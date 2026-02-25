const skillCategories = [
  {
    title: 'Languages',
    rows: [
      ['TypeScript', 'Lua'],
      ['Python', 'JavaScript'],
    ],
  },
  {
    title: 'Other',
    rows: [
      ['HTML', 'CSS', 'EJS', 'SCSS'],
      ['REST', 'Jinja'],
    ],
  },
  {
    title: 'Tools',
    rows: [
      ['VSCode', 'Neovim', 'Linux'],
      ['Figma', 'XFCE', 'Arch'],
      ['Git', 'Font Awesome'],
      ['KDE', 'fish'],
    ],
  },
  {
    title: 'Databases',
    rows: [
      ['SQLite', 'PostgreSQL'],
      ['Mongo'],
    ],
  },
  {
    title: 'Frameworks',
    rows: [
      ['React', 'Vue'],
      ['Disnake', 'Discord.js'],
      ['Flask', 'Express.js'],
    ],
  },
]

const Skills = () => {
  return (
    <section id="skills" className="py-20">
      <h2 className="text-3xl font-bold mb-12">#skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat, idx) => (
          <div
            key={idx}
            className="border border-gray-700 p-6 hover:border-purple transition-colors"
          >
            <h3 className="text-lg font-semibold text-purple mb-4">{cat.title}</h3>
            <div className="space-y-2">
              {cat.rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-wrap gap-x-3">
                  {row.map((item, i) => (
                    <span key={i} className="text-gray-300">
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills