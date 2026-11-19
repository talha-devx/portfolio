// data/projects.js
// The portfolio projects shown on the Projects page.
// To add a project: copy one block, give it the next id (5, 6, ...) and edit the text.
//   description  -> one bullet point per line (\n)
//   tech_stack   -> comma separated, e.g. "Python, PyTorch"
//   project_url  -> optional GitHub / demo link (null = no "View project" button)

module.exports = [
  {
    id: 1,
    title: 'Online Quiz System',
    category: 'Web Application',
    description: 'Created a web-based quiz application for attempting quizzes and viewing results.',
    tech_stack: 'HTML, CSS, JavaScript',
    project_url: null,
  },
  {
    id: 2,
    title: 'Movie Recommendation System',
    category: 'Recommendation System',
    description: 'Built a recommendation system that suggests movies to users based on their preferences.',
    tech_stack: 'Python',
    project_url: null,
  },
  {
    id: 3,
    title: 'MiniFS – Mini File System Simulator',
    category: 'Operating Systems',
    description:
      'Developed a block-based file system inside a virtual disk with superblock, free-space bitmap, inode table, write-ahead journal and Unix-style CLI.\n' +
      'Implemented indexed, linked and contiguous allocation, rwx permissions, crash recovery from the journal, fsck-style consistency checks and defragmentation.\n' +
      'Operating Systems project built in a team of 3.',
    tech_stack: 'Virtual Disk, Inode Table, Write-Ahead Journal, Unix-style CLI',
    project_url: null,
  },
  {
    id: 4,
    title: 'SmartSort AI – Garbage Classification',
    category: 'Deep Learning',
    description:
      'Built an image-based classifier that sorts waste into 13 recycling/disposal categories (plastic, glass, metal, paper, food, etc.).\n' +
      'Cleaned and de-duplicated the dataset, extracted EfficientNet-B0 embeddings, and compared CNN models against Decision Tree, SVM and Random Forest.\n' +
      'Delivered a Streamlit demo app with evaluation reports, metrics and plots.',
    tech_stack: 'Python, PyTorch, EfficientNet-B0, Scikit-learn, Streamlit',
    project_url: null,
  },
];
