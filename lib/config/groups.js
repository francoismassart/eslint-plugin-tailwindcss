module.exports.groups = [
  {
    type: 'LAYOUT',
    members: [
      {
        type: 'Container',
        members: [
          'container',
        ],
      },
      {
        type: 'Box Sizing',
        members: [
          'box\\-(border|content)',
        ],
      },

      {
        type: 'Sizing',
        members: [
          'width\\-\\d(\\.5)?',
        ],
      },
    ]
  }
];