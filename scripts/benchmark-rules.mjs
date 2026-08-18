import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

const RUNS = 5;
const COMPONENT_COUNT = 50;
const EXPECTED_MESSAGES = 250;
const BASELINE_TOTAL_MS = 3913.408;
const REQUIRED_IMPROVEMENT = 0.7;
const BASELINE_RULE_MS = {
  "tailwindcss/no-custom-classname": 1780.1,
  "tailwindcss/no-contradicting-classname": 1758.306,
  "tailwindcss/classnames-order": 336.698,
};

const createCorpus = () => {
  const components = Array.from({ length: COMPONENT_COUNT }, (_, index) => {
    const value = index + 1;
    const color = value.toString(16).padStart(6, "0");
    return `<div className="w-[${value}px] h-[${value}px] p-[${value}px] m-[${value}px] text-[${value}px] bg-[#${color}]" />`;
  }).join("\n");
  return `const App = () => <>${components}</>`;
};

const runChildBenchmark = async () => {
  const [{ Linter }, parser, { default: plugin }] = await Promise.all([
    import("eslint"),
    import("@typescript-eslint/parser"),
    import("../lib/index.mjs"),
  ]);
  const cssConfigPath = fileURLToPath(
    new URL("../tests/stubs/css/normal.css", import.meta.url),
  );
  const linter = new Linter({ configType: "flat" });
  const config = {
    files: ["**/*.tsx"],
    plugins: { tailwindcss: plugin },
    languageOptions: {
      parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { tailwindcss: { cssConfigPath } },
    rules: {
      "tailwindcss/no-custom-classname": "error",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/classnames-order": "error",
    },
  };

  const start = performance.now();
  const messages = linter.verify(createCorpus(), [config], {
    filename: "benchmark.tsx",
  });
  const totalMs = performance.now() - start;
  if (messages.length !== EXPECTED_MESSAGES) {
    throw new Error(
      `Expected ${EXPECTED_MESSAGES} diagnostics, received ${messages.length}`,
    );
  }
  console.log(`BENCH_RESULT ${JSON.stringify({ totalMs, messages: messages.length })}`);
};

const median = (values) => {
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor(sorted.length / 2)];
};

const percentage = (baseline, current) =>
  `${(((baseline - current) / baseline) * 100).toFixed(1)}%`;

const runParentBenchmark = () => {
  const scriptPath = fileURLToPath(import.meta.url);
  const results = [];

  for (let run = 1; run <= RUNS; run++) {
    const child = spawnSync(process.execPath, [scriptPath, "--child"], {
      encoding: "utf8",
      env: { ...process.env, TIMING: "all" },
    });
    if (child.error) throw child.error;
    if (child.status !== 0) {
      throw new Error(child.stderr || child.stdout || `Run ${run} failed`);
    }

    const resultMatch = child.stdout.match(/^BENCH_RESULT (.+)$/m);
    if (!resultMatch) throw new Error(`Run ${run} returned no benchmark data`);
    const result = JSON.parse(resultMatch[1]);
    const ruleTimes = {};
    for (const ruleName of Object.keys(BASELINE_RULE_MS)) {
      const escapedRuleName = ruleName.replaceAll("/", String.raw`\/`);
      const timingMatch = child.stdout.match(
        new RegExp(`${escapedRuleName}\\s+\\|\\s+([\\d.]+)`),
      );
      if (!timingMatch) throw new Error(`Missing timing for ${ruleName}`);
      ruleTimes[ruleName] = Number(timingMatch[1]);
    }
    results.push({ ...result, ruleTimes });
    console.log(`Run ${run}: ${result.totalMs.toFixed(1)} ms`);
  }

  const totalMedian = median(results.map(({ totalMs }) => totalMs));
  console.log("\nMedian results (five cold processes)");
  console.log(
    `Total: ${totalMedian.toFixed(1)} ms (${percentage(BASELINE_TOTAL_MS, totalMedian)} faster)`,
  );
  for (const [ruleName, baseline] of Object.entries(BASELINE_RULE_MS)) {
    const current = median(
      results.map(({ ruleTimes }) => ruleTimes[ruleName]),
    );
    console.log(
      `${ruleName}: ${current.toFixed(1)} ms (${percentage(baseline, current)} faster)`,
    );
  }

  const maximumAccepted = BASELINE_TOTAL_MS * (1 - REQUIRED_IMPROVEMENT);
  if (totalMedian > maximumAccepted) {
    throw new Error(
      `Median ${totalMedian.toFixed(1)} ms exceeds the ${maximumAccepted.toFixed(1)} ms performance gate`,
    );
  }
};

if (process.argv.includes("--child")) {
  await runChildBenchmark();
} else {
  runParentBenchmark();
}
