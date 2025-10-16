import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Briefcase, GraduationCap, Code, Database, Monitor, Wrench } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-white">
      {/* Header */}
      <header className="bg-slate-900 text-white py-16 px-6 print:bg-white print:text-black print:py-2 print:border-b print:border-black">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 print:text-2xl print:mb-0.5">Sean J. Hankins</h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6 print:text-base print:text-black print:mb-1">Computer Programmer</p>
          
          <div className="flex flex-wrap gap-4 text-sm md:text-base print:gap-2 print:text-[10px] print:leading-tight">
            <a href="mailto:scarabdesign@gmail.com" className="flex items-center gap-2 hover:text-slate-300 transition print:text-black">
              <Mail size={18} className="print:hidden" />
              <span>scarabdesign@gmail.com</span>
            </a>
            <a href="tel:+15415050723" className="flex items-center gap-2 hover:text-slate-300 transition print:text-black">
              <Phone size={18} className="print:hidden" />
              <span>(541) 505-0723</span>
            </a>
            <span className="flex items-center gap-2 print:text-black">
              <MapPin size={18} className="print:hidden" />
              <span>Eugene, OR</span>
            </span>
            <a href="https://linkedin.com/in/sean-hankins" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-300 transition print:text-black">
              <Linkedin size={18} className="print:hidden" />
              <span>linkedin.com/in/sean-hankins</span>
            </a>
            <a href="https://github.com/scarabdesign" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-slate-300 transition print:text-black">
              <Github size={18} className="print:hidden" />
              <span>github.com/scarabdesign</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 print:py-1 print:px-4">
        {/* Experience Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:shadow-none print:p-0 print:mb-1 print:rounded-none">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 print:text-sm print:mb-1 print:border-b print:border-gray-400 print:pb-0.5">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            <Briefcase size={28} className="print:hidden" />
            Experience
          </h2>
          
          <div className="space-y-8 print:space-y-1">
            <div className="print:break-inside-avoid">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 print:mb-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 print:text-[11px] print:font-bold">Lead Full Stack Application Developer</h3>
                  <p className="text-blue-600 font-medium print:text-black print:text-[10px] print:italic">
                    <a href="https://www.enroutepro.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Perpetua Technologies, LLC
                    </a>
                  </p>
                </div>
                <span className="text-slate-600 text-sm md:text-base print:text-[10px]">Mar 2019 - Present</span>
              </div>
              <p className="text-slate-700 mb-3 print:text-[10px] print:mb-1">Responsible for design, coding and maintenance of:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 print:text-[10px] print:space-y-0 print:leading-tight">
                <li>A suite of mobile applications to support fire fighters and first-responders in the field (Xamarin: Android/iOS/Windows)</li>
                <li>An extensive WebSocket / RESTful API to support the mobile suite with live emergency incident data and tracking (C#, .NET)</li>
                <li>A Web based interface for higher level aspects of managing personnel and apparatus of fire/medical agencies (ASP.NET MVC)</li>
                <li>API tools for downloading and parsing third party wildfire/hotspot datasets for on-map visualization (Python, C#, others)</li>
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 print:mb-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 print:text-[11px] print:font-bold">Senior Software Developer</h3>
                  <p className="text-blue-600 font-medium print:text-black print:text-[10px] print:italic">
                    <a href="https://www.clarity-ventures.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Clarity Ventures Inc.
                    </a>
                  </p>
                </div>
                <span className="text-slate-600 text-sm md:text-base print:text-[10px]">Jun 2025 - Oct 2025</span>
              </div>
              <p className="text-slate-700 mb-3 print:text-[10px] print:mb-1">Responsible for designing, coding and troubleshooting:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 print:text-[10px] print:space-y-0 print:leading-tight">
                <li>Custom e-commerce APIs for enterprise clients using C#, with Docker, K8s, Azure DevOps and Azure Functions</li>
                <li>Developing connection APIs for OData services, including SAP Concur and Epicore E10/11 and P21</li>
                <li>Project documentation and client communication</li>
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 print:mb-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 print:text-[11px] print:font-bold">Senior Software Engineer</h3>
                  <p className="text-blue-600 font-medium print:text-black print:text-[10px] print:italic">
                    <a href="https://twentyideas.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Twenty Ideas
                    </a>
                  </p>
                </div>
                <span className="text-slate-600 text-sm md:text-base print:text-[10px]">Nov 2023 - Nov 2024</span>
              </div>
              <p className="text-slate-700 mb-3 print:text-[10px] print:mb-1">Part of a large team of developers designing and coding a software distribution platform, responsible for:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 print:text-[10px] print:space-y-0 print:leading-tight">
                <li>Back-end development in C# .NET and MSSQL Database with Front-end development in React</li>
                <li>Amazon (AWS) storage and lambdas</li>
                <li>Design, implementation, testing and documentation</li>
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 print:mb-0">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 print:text-[11px] print:font-bold">Lead Front End Application Developer</h3>
                  <p className="text-blue-600 font-medium print:text-black print:text-[10px] print:italic">
                    <a href="https://moonshadowmobile.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Moonshadow Mobile, Inc.
                    </a>
                  </p>
                </div>
                <span className="text-slate-600 text-sm md:text-base print:text-[10px]">Nov 2007 - Feb 2019</span>
              </div>
              <p className="text-slate-700 mb-3 print:text-[10px] print:mb-1">Responsible for design, coding and maintenance of:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 print:text-[10px] print:space-y-0 print:leading-tight">
                <li>Complex web application interfaces focusing on big data visualization and IoT (JavaScript, HTML, Node.js, Bing Maps, Google Maps, OpenStreetMap)</li>
                <li>A multi-platform mobile application that communicates to vehicles with OBD2 and tracks location (Python, Node.js)</li>
                <li>Complex web application interfaces and API focusing on voter data, walking list creation and data analytics (JavaScript/jQuery)</li>
                <li>iOS applications used to view, gather, map and synchronize data with system servers while mobile (Objective C)</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:shadow-none print:p-0 print:mb-1 print:rounded-none print:break-inside-avoid">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 print:text-sm print:mb-1 print:border-b print:border-gray-400 print:pb-0.5">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            <GraduationCap size={28} className="print:hidden" />
            Education
          </h2>
          
          <div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 print:text-[11px] print:font-bold">Associate of Applied Science (Computer Programming)</h3>
                <p className="text-blue-600 font-medium print:text-black print:text-[10px] print:italic">Lane Community College • GPA: 3.69</p>
              </div>
              <span className="text-slate-600 text-sm md:text-base print:text-[10px]">2007</span>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:shadow-none print:p-0 print:mb-0 print:rounded-none print:break-inside-avoid">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3 print:text-sm print:mb-1 print:border-b print:border-gray-400 print:pb-0.5">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            <Code size={28} className="print:hidden" />
            Skills
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-x-3 print:gap-y-1">
            <div className="print:break-inside-avoid">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 print:text-[10px] print:mb-0.5 print:font-bold">
                <Code size={20} className="text-blue-600 print:hidden" />
                Languages
              </h3>
              <ul className="flex flex-wrap gap-2 print:block print:list-disc print:list-inside print:m-0 print:p-0">
                {['C# / .NET', 'JavaScript', 'HTML/CSS', 'Python', 'Java', 'PHP'].map(skill => (
                  <li key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm print:bg-white print:text-black print:px-0 print:py-0 print:text-[10px] print:leading-tight">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="print:break-inside-avoid">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 print:text-[10px] print:mb-0.5 print:font-bold">
                <Monitor size={20} className="text-green-600 print:hidden" />
                Platforms
              </h3>
              <ul className="flex flex-wrap gap-2 print:block print:list-disc print:list-inside print:m-0 print:p-0">
                {['jQuery', 'Node.js', 'ASP.NET', 'React', 'Android', 'iOS'].map(skill => (
                  <li key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm print:bg-white print:text-black print:px-0 print:py-0 print:text-[10px] print:leading-tight">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 print:text-[10px] print:mb-0.5 print:font-bold">
                <Database size={20} className="text-purple-600 print:hidden" />
                Storage
              </h3>
              <ul className="flex flex-wrap gap-2 print:block print:list-disc print:list-inside print:m-0 print:p-0">
                {['MSSQL', 'SQLite', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'MongoDB', 'Redis'].map(skill => (
                  <li key={skill} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm print:bg-white print:text-black print:px-0 print:py-0 print:text-[10px] print:leading-tight">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="print:break-inside-avoid">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 print:text-[10px] print:mb-0.5 print:font-bold">
                <Wrench size={20} className="text-orange-600 print:hidden" />
                Tools & OS
              </h3>
              <ul className="flex flex-wrap gap-2 print:block print:list-disc print:list-inside print:m-0 print:p-0">
                {['Visual Studio', 'Rider', 'VS Code', 'Git', 'Jira', 'Linux', 'Windows', 'Mac', 'Claude', 'ChatGPT'].map(skill => (
                  <li key={skill} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm print:bg-white print:text-black print:px-0 print:py-0 print:text-[10px] print:leading-tight">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-6 mt-12 print:hidden">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Sean J. Hankins. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}