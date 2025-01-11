export default class ModalContentProvider {
  constructor() {
    this.modalContents = {
      aboutMe: {
        title: 'About me',
        description:
          `<span class='titles'>👨‍💻 Senior Software Developer | 3+ Years Experience | Front-End Development
          <br/>
          ⚙️ Scalable & Modular Solutions | 🚀 Driving Seamless User Experiences 
          <br/>
          🌟 Leading Cross-Functional Teams</span>
          <br/><br/>
          Hi, I’m Hamilton – a passionate software developer specializing in <b>front-end</b> and <b>full-stack development</b>. With expertise in <b>Next.js</b>, <b>TypeScript</b>, <b>Node.js</b>, <b>Tailwind CSS</b>, and <b>Three.js</b>, I craft seamless, scalable solutions that bridge creativity and functionality. ✨
          <br/><br/>
          I thrive on tackling challenges that push me to grow, always eager to embrace opportunities to <b>learn</b>, <b>innovate</b>, and <b>elevate</b> my craft.
          <br/><br/>
          Currently, I’m a <b>Senior Frontend Developer</b> at <a href='https://niloom.ai' target='_blank'>Niloom</a>, where I lead projects that deliver impactful user experiences. 📈`,
      },
      projects: {
        title: 'Projects',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      contactMe: {
        title: 'Contact Me',
        description:
          `Let’s connect!
          <br/><br/>
          Whether you have a project idea, collaboration in mind, or just want to say hi, feel free to reach out.
          <br/><br/>
          • Find me on: <a href='https://www.linkedin.com/in/hamilton-seguin-6a5783270/?locale=en_US' target='_blank'>LinkedIn</a>
          <br/>
          • <a href='mailto:hamilton.seguin@gmail.com'>Email me</a>
          <br/><br/>
          You can also follow my work or reach out via these platforms:
          <br/><br/>
          • <a href='https://github.com/hamilton-seguin' target='_blank'>GitHub</a>
          <br/><br/>
          I look forward to hearing from you!`,
      },
      tutorial: {
        title: 'Tutorial',
        description:
          'Z / ↑ : Forward <br/> A / ← : Left <br/> S / ↓ : Backward <br/> D / → : Right <br/> Space : Jump <br/> F : Special',
      },
    }
  }

  getModalInfo(portalName) {
    return this.modalContents[portalName]
  }
}
