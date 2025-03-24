export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  location: string;
  salary: string;
  type: JobType;
  description: string;
  posted: string;
  featured?: boolean;
  requirements: string[];
  logo: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  founded: string;
  size: string;
  logo: string;
  coverImage?: string;
  jobs?: string[];
}

export const jobTypes: JobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export const locations = [
  'San Francisco, CA',
  'New York, NY',
  'Los Angeles, CA',
  'Austin, TX',
  'Seattle, WA',
  'Chicago, IL',
  'Boston, MA',
  'Remote'
];

export const companies: Company[] = [
  {
    id: 'apple',
    name: 'Apple',
    description: 'Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.',
    website: 'https://www.apple.com',
    location: 'Cupertino, CA',
    industry: 'Technology',
    founded: '1976',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/apple.com',
    coverImage: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['apple-1', 'apple-2']
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products.',
    website: 'https://www.google.com',
    location: 'Mountain View, CA',
    industry: 'Technology',
    founded: '1998',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/google.com',
    coverImage: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['google-1', 'google-2']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    description: 'Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington.',
    website: 'https://www.microsoft.com',
    location: 'Redmond, WA',
    industry: 'Technology',
    founded: '1975',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/microsoft.com',
    coverImage: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['microsoft-1']
  },
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    website: 'https://www.amazon.com',
    location: 'Seattle, WA',
    industry: 'Technology, Retail',
    founded: '1994',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/amazon.com',
    coverImage: 'https://images.unsplash.com/photo-1565439312768-4a6a10a2e59c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['amazon-1', 'amazon-2']
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'Netflix, Inc. is an American subscription streaming service and production company.',
    website: 'https://www.netflix.com',
    location: 'Los Gatos, CA',
    industry: 'Entertainment, Technology',
    founded: '1997',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/netflix.com',
    coverImage: 'https://images.unsplash.com/photo-1522869635100-187f6605241d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['netflix-1']
  },
  {
    id: 'meta',
    name: 'Meta',
    description: 'Meta Platforms, Inc., doing business as Meta, is an American multinational technology conglomerate based in Menlo Park, California.',
    website: 'https://www.meta.com',
    location: 'Menlo Park, CA',
    industry: 'Technology',
    founded: '2004',
    size: '10,000+',
    logo: 'https://logo.clearbit.com/meta.com',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    jobs: ['meta-1']
  },
];

export const jobs: Job[] = [
  {
    id: 'apple-1',
    title: 'Senior iOS Developer',
    company: 'Apple',
    companyId: 'apple',
    location: 'Cupertino, CA',
    salary: '$150K - $180K',
    type: 'Full-time',
    description: 'As a Senior iOS Developer, you will be responsible for designing and building advanced applications for the iOS platform. You will collaborate with cross-functional teams to define, design, and ship new features.',
    posted: '2 days ago',
    featured: true,
    requirements: [
      '5+ years experience in iOS development',
      'Proficiency with Swift and Objective-C',
      'Experience with iOS frameworks such as Core Data, Core Animation',
      'Experience with RESTful APIs to connect iOS applications to back-end services',
      'Knowledge of other web technologies and UI/UX standards',
      "Understanding of Apple's design principles and interface guidelines"
    ],
    logo: 'https://logo.clearbit.com/apple.com'
  },
  {
    id: 'apple-2',
    title: 'Product Designer',
    company: 'Apple',
    companyId: 'apple',
    location: 'Cupertino, CA',
    salary: '$120K - $150K',
    type: 'Full-time',
    description: 'We are looking for a Product Designer to design digital products with a primary focus on user experience. The ideal candidate has a strong portfolio showcasing their ability to solve complex problems and create intuitive user experiences.',
    posted: '1 week ago',
    featured: false,
    requirements: [
      '3+ years of product design experience',
      'Portfolio showcasing end-to-end design process',
      'Experience with design tools like Figma or Sketch',
      'Strong understanding of UX principles',
      'Collaborative mindset and ability to work with cross-functional teams'
    ],
    logo: 'https://logo.clearbit.com/apple.com'
  },
  {
    id: 'google-1',
    title: 'Software Engineer, Machine Learning',
    company: 'Google',
    companyId: 'google',
    location: 'Mountain View, CA',
    salary: '$160K - $200K',
    type: 'Full-time',
    description: 'As a Software Engineer in Machine Learning, you will design and implement ML algorithms and systems. You will collaborate with a multi-disciplinary team of engineers and researchers to develop solutions for Google products and services.',
    posted: '3 days ago',
    featured: true,
    requirements: [
      'MS or PhD in Computer Science or related technical field',
      'Experience in machine learning, deep learning, or AI',
      'Proficiency in Python and TensorFlow',
      'Strong problem-solving and algorithmic skills',
      'Experience with large-scale data processing systems'
    ],
    logo: 'https://logo.clearbit.com/google.com'
  },
  {
    id: 'google-2',
    title: 'UX Researcher',
    company: 'Google',
    companyId: 'google',
    location: 'New York, NY',
    salary: '$130K - $160K',
    type: 'Full-time',
    description: 'As a UX Researcher, you will work closely with designers, product managers, and engineers to identify research needs, conduct user research, and share actionable insights. Your work will directly influence Google products used by billions of people.',
    posted: '1 week ago',
    featured: false,
    requirements: [
      "Master's degree or PhD in HCI, Cognitive Psychology, or related field",
      '2+ years experience in UX research',
      'Experience with qualitative and quantitative research methods',
      'Strong communication and presentation skills',
      'Ability to translate research findings into actionable product recommendations'
    ],
    logo: 'https://logo.clearbit.com/google.com'
  },
  {
    id: 'microsoft-1',
    title: 'Full Stack Developer',
    company: 'Microsoft',
    companyId: 'microsoft',
    location: 'Redmond, WA',
    salary: '$140K - $180K',
    type: 'Full-time',
    description: 'We are looking for a Full Stack Developer to build and maintain web applications. You will be responsible for developing and designing front end web architecture, ensuring the responsiveness of applications, and working alongside product managers and UI/UX designers.',
    posted: '5 days ago',
    featured: true,
    requirements: [
      '3+ years experience with front-end and back-end technologies',
      'Proficiency in JavaScript, TypeScript, and modern frameworks like React',
      'Experience with server-side technologies like Node.js',
      'Understanding of RESTful APIs and database technologies',
      'Knowledge of cloud services, preferably Azure'
    ],
    logo: 'https://logo.clearbit.com/microsoft.com'
  },
  {
    id: 'amazon-1',
    title: 'Solutions Architect',
    company: 'Amazon',
    companyId: 'amazon',
    location: 'Seattle, WA',
    salary: '$130K - $170K',
    type: 'Full-time',
    description: 'As a Solutions Architect, you will use your combination of technical knowledge and business acumen to help customers build cloud solutions using AWS services. You will influence AWS service roadmaps and provide guidance on architecture best practices.',
    posted: '2 weeks ago',
    featured: false,
    requirements: [
      '5+ years of experience in IT or cloud-related technical roles',
      'Experience designing distributed systems and architectures',
      'Knowledge of AWS services and how they fit together',
      'Strong written and verbal communication skills',
      'Ability to translate complex technical information to a variety of audiences'
    ],
    logo: 'https://logo.clearbit.com/amazon.com'
  },
  {
    id: 'amazon-2',
    title: 'Data Scientist',
    company: 'Amazon',
    companyId: 'amazon',
    location: 'Austin, TX',
    salary: '$120K - $160K',
    type: 'Full-time',
    description: 'We are seeking a Data Scientist to help us derive insights from complex data sets. You will work with stakeholders to identify opportunities for data-driven solutions and develop statistical models to address business challenges.',
    posted: '3 days ago',
    featured: true,
    requirements: [
      "Master's or PhD in a quantitative field (Statistics, Mathematics, Computer Science)",
      'Experience with statistical analysis and machine learning',
      'Proficiency in Python, R, or similar programming languages',
      'Experience with SQL and data visualization tools',
      'Strong problem-solving and critical thinking skills'
    ],
    logo: 'https://logo.clearbit.com/amazon.com'
  },
  {
    id: 'netflix-1',
    title: 'Content Marketing Manager',
    company: 'Netflix',
    companyId: 'netflix',
    location: 'Los Gatos, CA',
    salary: '$110K - $130K',
    type: 'Full-time',
    description: 'As a Content Marketing Manager, you will develop and execute content strategies to engage with customers and promote our original content. You will collaborate with creative teams, marketing partners, and cross-functional teams to create compelling marketing campaigns.',
    posted: '1 week ago',
    featured: false,
    requirements: [
      '5+ years of content marketing or similar experience',
      'Strong portfolio of content creation and campaign management',
      'Excellent writing and editing skills',
      'Experience with digital marketing channels and analytics',
      'Strategic thinker with creative mindset'
    ],
    logo: 'https://logo.clearbit.com/netflix.com'
  },
  {
    id: 'meta-1',
    title: 'AR/VR Software Engineer',
    company: 'Meta',
    companyId: 'meta',
    location: 'Menlo Park, CA',
    salary: '$150K - $190K',
    type: 'Full-time',
    description: 'As an AR/VR Software Engineer, you will develop technologies that make AR and VR experiences more immersive, intuitive, and realistic. You will work on solving complex problems in computer vision, graphics, animation, and human-computer interaction.',
    posted: '4 days ago',
    featured: true,
    requirements: [
      'BS/MS in Computer Science or related technical field',
      'Experience with 3D graphics, computer vision, or AR/VR development',
      'Proficiency in C++, C#, or similar programming languages',
      'Experience with Unity or Unreal Engine',
      'Strong mathematical foundation in linear algebra and 3D geometry'
    ],
    logo: 'https://logo.clearbit.com/meta.com'
  },
  {
    id: 'remote-1',
    title: 'Frontend Developer',
    company: 'Stripe',
    companyId: 'stripe',
    location: 'Remote',
    salary: '$100K - $130K',
    type: 'Remote',
    description: 'We are looking for a Frontend Developer to join our distributed team. You will be responsible for implementing visual elements and user interactions for our web applications, ensuring a seamless user experience across different devices and browsers.',
    posted: '3 days ago',
    featured: false,
    requirements: [
      '2+ years of frontend development experience',
      'Proficiency in HTML, CSS, JavaScript, and modern frameworks like React',
      'Experience with responsive design and cross-browser compatibility',
      'Knowledge of frontend build tools and task runners',
      'Ability to work independently in a remote environment'
    ],
    logo: 'https://logo.clearbit.com/stripe.com'
  },
  {
    id: 'internship-1',
    title: 'Software Engineering Intern',
    company: 'Figma',
    companyId: 'figma',
    location: 'San Francisco, CA',
    salary: '$30-$45/hr',
    type: 'Internship',
    description: 'Join our engineering team for a summer internship. You will work alongside experienced engineers on real projects, gaining hands-on experience with our product development lifecycle. This is a perfect opportunity for students looking to gain practical experience in a fast-paced tech environment.',
    posted: '5 days ago',
    featured: false,
    requirements: [
      'Currently pursuing a degree in Computer Science or related field',
      'Familiarity with at least one programming language',
      'Basic understanding of data structures and algorithms',
      'Eager to learn and work in a collaborative environment',
      'Available for at least 12 weeks during summer'
    ],
    logo: 'https://logo.clearbit.com/figma.com'
  },
  {
    id: 'contract-1',
    title: 'DevOps Engineer',
    company: 'Slack',
    companyId: 'slack',
    location: 'Remote',
    salary: '$75-$95/hr',
    type: 'Contract',
    description: 'We are seeking a contract DevOps Engineer to help us implement and maintain our CI/CD pipelines. This is a 6-month contract with possibility of extension. You will work with our development team to automate deployment processes and improve system reliability.',
    posted: '1 week ago',
    featured: false,
    requirements: [
      '3+ years experience in DevOps or similar role',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Proficiency with containerization technologies like Docker and Kubernetes',
      'Knowledge of Infrastructure as Code tools like Terraform',
      'Strong scripting skills (Python, Bash)'
    ],
    logo: 'https://logo.clearbit.com/slack.com'
  }
];

//

