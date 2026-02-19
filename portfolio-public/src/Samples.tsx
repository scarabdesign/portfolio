import React from 'react';
import { ExternalLink } from 'lucide-react';

type SubDividerProps = {
  children: React.ReactNode;
  title: string;
  location: string;
  link?: string;
};

function SubDivider({ children, title, location, link }: SubDividerProps) {
  return (
    <div className="mb-8 print:mb-2 print:break-inside-avoid">
      <h3 className="text-2xl font-semibold text-slate-900 mb-2 print:text-[11px] print:font-bold print:mb-0">{title}</h3>
      <div className="h-px bg-slate-300 mb-3 print:mb-0.5"></div>
      <div className="flex items-center gap-2 mb-4 print:mb-0.5">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1 print:text-[9px] print:text-black print:underline"
          >
            {location}
            <ExternalLink size={16} className="print:hidden" />
          </a>
        ) : (
          <span className="text-slate-600 print:text-[9px] print:text-black">{location}</span>
        )}
      </div>
      <div className="text-slate-700 print:text-[9px] print:text-black print:leading-tight">{children}</div>
    </div>
  );
}

export default function Samples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 print:bg-none print:from-transparent print:to-transparent">
      {/* Header */}
      <header className="bg-slate-900 text-white py-12 px-6 print:!bg-transparent print:text-black print:py-1 print:border-b print:border-black">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 print:text-2xl print:mb-0.5">Portfolio Samples</h1>
          <div className="flex justify-between items-baseline">
            <p className="text-xl text-slate-300 print:text-base print:text-black">Sean J. Hankins</p>
            <p className="hidden print:block print:text-[9px] print:text-black">https://seanhankins.com</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 print:py-1 print:px-4">
        {/* Independent Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:!bg-transparent print:shadow-none print:p-0 print:mb-1 print:rounded-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3 print:text-sm print:mb-1 print:border-b print:border-gray-400 print:pb-0.5">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            Independent Projects
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8 print:text-[9px] print:mb-2 print:leading-tight">
            Coding is my job, hobby and livelihood. Here are a few things I've created or helped to create of which I'm most proud.
          </p>

          <SubDivider
            title="Viands"
            location="github.com/scarabdesign/Viands"
            link="https://github.com/scarabdesign/Viands"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 flex gap-4 justify-center print:hidden">
                <video width="240" height="533" controls className="rounded shadow-lg">
                  <source src="./resources/ViandsDemo2Compressed.mp4" type="video/mp4" />
                </video>
                <video width="240" height="533" controls className="rounded shadow-lg">
                  <source src="./resources/ViandsDemoCompressed.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="hidden print:block print:col-span-1">
                <img src="/resources/ViandsScreen.png" className="max-w-[150px] rounded-none shadow-none" alt="Viands" />
              </div>
              <div className="print:col-span-2">
                <p className="mb-4 print:mb-1">
                  Personalized shopping list program written with .NET8 MAUI Blazor and an SQLite store. The back-end API was written with NestJS/NodeJs/ExpressJS with a PostgreSQL store.
                </p>
                <p>
                  Viands is a suite of applications for Windows, iOS and Android (more platforms to come) that allows a user to add products and line items to shopping lists and mark them off as they shop. Also boasts a barcode scanner for easy product additions and a cloud backup scheme.
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title="Chess"
            location="chess.pointlesswaste.com"
            link="https://chess.pointlesswaste.com"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:col-span-1">
                <img src="/resources/ChessScreen.png" className="w-full rounded shadow-lg print:shadow-none print:rounded-none print:max-w-[150px]" alt="Chess Game" />
              </div>
              <div className="print:col-span-2">
                <p className="mb-4 print:mb-1">
                  This is a simple chess application coded in React 18 with Vite and a NestJS API. I'm using a WebSocket to communicate with the chess AI Stockfish.
                </p>
                <p>
                  You can view the source code on my GitHub page:{' '}
                  <a
                    href="https://github.com/scarabdesign/portfolio/blob/main/portfolio-public/src/chess/Chess.tsx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline print:text-black print:underline"
                  >
                    github.com/scarabdesign/portfolio
                  </a>
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title='MailTrash'
            location='pointlesswaste.com'
            link='https://pointlesswaste.com'
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:col-span-1">
                <img src="/resources/MailTrashScreen.png" className="w-full rounded shadow-lg print:shadow-none print:rounded-none print:max-w-[150px]" alt="MailTrash" />
              </div>
              <div className="print:col-span-2">
                <p className="mb-4 print:mb-1">
                  Here is a sample email campaigns application that I created as a proof of concept. It's written in C# using .NET Aspire and deployed to a K8s cluster with Helm.
                </p>
                <p>
                  You can view the source code on my GitHub page:{' '}
                  <a
                    href="https://github.com/scarabdesign/MailTrash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline print:text-black print:underline"
                  >
                    github.com/scarabdesign/MailTrash
                  </a>
                </p>
              </div>
            </div>
          </SubDivider>

        </section>

        {/* Perpetua Technologies Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:!bg-transparent print:shadow-none print:p-0 print:mb-1 print:rounded-none">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3 print:text-sm print:mb-0.5 print:border-b print:border-gray-400 print:pb-0">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            Perpetua Technologies, LLC
          </h2>

          <SubDivider
            title="EnRoutePro Cloud"
            location="enroutepro.com"
            link="https://www.enroutepro.com/"
          >
            <div>
              <img src="/resources/ERPCScreen.png" className="float-left mr-6 mb-4 w-2/3 lg:w-1/2 rounded shadow-lg print:shadow-none print:rounded-none print:w-[200px] print:mr-3 print:mb-1" alt="EnRoutePro Cloud" />
              <p className="mb-4 print:mb-1">
                EnRoutePro Cloud is a cloud-native computer-aided dispatch (CAD) and resource management platform built for fire departments and emergency services. It provides real-time incident dispatching, apparatus and personnel tracking, map-based situational awareness with integrated fire detection data, and multi-channel alert delivery via push notifications, SMS, and email. The platform supports both web-based dispatch centers and mobile field units, enabling coordinated emergency response across distributed teams.
              </p>
              <p className="mb-4 print:mb-1">
                The system manages the full lifecycle of emergency operations — from CAD email ingestion and incident creation through unit dispatch, en-route tracking, and post-incident reporting. Built on .NET 10 with a Blazor Server frontend, RESTful API layer, and SignalR hubs supporting 200K+ concurrent connections, it delivers real-time updates to dispatchers and field personnel simultaneously. Structured logging, distributed tracing, and integrated mapping with Google Maps and NASA FIRMS fire detection provide operational intelligence at every level.
              </p>
              <p className="mb-4 print:mb-1">
                EnRoutePro Cloud is a ground-up modernization of the legacy EnRoutePro platform, consolidating 63 projects across 19 solutions into a streamlined 11-project architecture — an 83% reduction in codebase complexity. The monolithic 6,700-line API handler was decomposed into 38 RESTful controllers with OpenAPI documentation, async coverage grew from 8% to 37%, and test coverage expanded 31x from 7 to 217 test files across xUnit, Playwright, and Jest. Infrastructure moved from Windows Server, IIS, and SQL Server to Linux containers with PostgreSQL and PostGIS, eliminating proprietary database licensing costs and enabling deployment on minimal infrastructure.
              </p>
              <p>
                AI-assisted development with Claude Code accelerated the modernization effort, driving automated test generation, code migration, architectural refactoring, and documentation. The legacy custom WebSocket implementation was replaced with SignalR hubs, and the platform adopted structured logging with Serilog, Seq, and OpenTelemetry for full observability. Orchestrated with .NET Aspire and Docker, EnRoutePro Cloud delivers a maintainable, cost-effective foundation positioned for continued growth.
              </p>
            </div>
          </SubDivider>

          <div className="print:break-before-page"></div>
          <SubDivider
            title="EnRoutePro 4"
            location="enroutepro.com"
            link="https://www.enroutepro.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:hidden">
                <video width="100%" controls className="rounded shadow-lg">
                  <source src="./resources/EnRoutePro4_Demo.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="hidden print:block print:col-span-1">
                <img src="/resources/ERP4Screen.jpg" className="max-w-[150px] rounded-none shadow-none" alt="EnRoutePro 4" />
              </div>
              <div className="print:col-span-2">
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video demo available at seanhankins.com/samples</p>
                <p className="mb-4 print:mb-1">
                  Here is a quick demo of the latest EnRoutePro version in its fledgling state. It shows the basic incident list, fed by the latest emergency incidents from the state's EMS reporting system, and a details panel to give more information per incident.
                </p>
                <p className="mb-4 print:mb-1">
                  There's also a Map Book feature that allows responders to view digitalized documents containing pertinent emergency information like fire hydrant locations and building escape plans.
                </p>
                <p className="mb-4 print:mb-1">
                  The app also allows responders to set up notifications to get notified when other personnel or apparatus are dispatched to an incident.
                </p>
                <p>
                  This application was written in .NET 9 MAUI and was busted out in about a month. Much more is planned on the app, and it's great fun to work on.
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title="Active Fire Animations"
            location="enroutepro.com"
            link="https://www.enroutepro.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:hidden">
                <video width="100%" controls className="rounded shadow-lg">
                  <source src="./resources/FireAnimation.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="hidden print:block print:col-span-1">
                <img src="/resources/FireAnimationScreen.png" className="max-w-[150px] rounded-none shadow-none" alt="Active Fire Animations" />
              </div>
              <div className="print:col-span-2">
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video demo available at seanhankins.com/samples</p>
                <p className="mb-4 print:mb-1">
                  This is a small part of an application that helps municipal fire agencies track incidents, apparatus and personnel in active response.
                </p>
                <p className="mb-4 print:mb-1">
                  The video on the right is an animation of part of the 2023 Bedrock fire east of Eugene/Springfield. The data is from stored fire hotspot sources from NASA (MODIS/VIIRS/GOES), and the outline is the InciWeb boundary for the fire.
                </p>
                <p>
                  The tool animates over buckets of time slots per day. The color of the points reflects the relative hotspot temperatures and the dark shapes are the affected ("burned") areas.
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title="EnRoutePro 3"
            location="enroutepro.com"
            link="https://www.enroutepro.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:hidden">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/9QN-uOg6lnw?si=2Bu6z2F7lUXGr_ct"
                  title="ERP Demo"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div className="hidden print:block print:col-span-1">
                <img src="/resources/ERP3Screen.png" className="max-w-[150px] rounded-none shadow-none" alt="EnRoutePro 3" />
              </div>
              <div className="print:col-span-2">
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video: youtu.be/9QN-uOg6lnw</p>
                <p className="mb-4 print:mb-1">
                  EnroutePro is a suite of mobile applications used by fire agencies to track and manage active fire/medical incidents. The application is supported on Windows, iOS and Android and is intended to be installed on devices in the emergency vehicles and personal phones.
                </p>
                <p>
                  The clients communicate to the ERP API servers with Web Sockets and POST/GET requests. There is also a management back-end that allows managers to remotely assign and track responders.
                </p>
              </div>
            </div>
          </SubDivider>
        </section>

        {/* Moonshadow Mobile Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8 print:!bg-transparent print:shadow-none print:p-0 print:mb-1 print:rounded-none print:break-before-page">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3 print:text-sm print:mb-0.5 print:border-b print:border-gray-400 print:pb-0">
            <div className="w-1 h-8 bg-blue-600 rounded print:hidden"></div>
            Moonshadow Mobile, Inc
          </h2>

          <SubDivider
            title="DB4IoT"
            location="moonshadowmobile.com"
            link="https://moonshadowmobile.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-3">
              <div className="lg:col-span-2 print:hidden">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/ysnUElHeZw0?si=TCpNlrc8Ao76r-u0"
                  title="DB4IoT Demo"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div className="hidden print:block print:col-span-1">
                <img src="/resources/DB4IoTScreen.png" className="max-w-[150px] rounded-none shadow-none" alt="DB4IoT" />
              </div>
              <div className="print:col-span-2">
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video: youtu.be/ysnUElHeZw0</p>
                <p>
                  Db4IoT is a product used by any organization or government entity who needs to collect and analyze traffic patterns and visualize big data sets on maps and graphs. My part in the team was mostly the front-end interface the users see as well as some management back-end functionality and other services.
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title="VoterMapping"
            location="moonshadowmobile.com"
            link="https://moonshadowmobile.com/company/examples/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:space-y-1">
              <div className="lg:col-span-2 print:hidden">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/o1_gCiRy8GM?si=dDrw2VPppUL4_bB0"
                  title="VoterMapping"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div>
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video: youtu.be/o1_gCiRy8GM</p>
                <p>
                  VoterMapping was a web application that tracked public voter history and visualized them over maps. Tools allowed users to do analysis, draw walking lists, draw bounding shapes, masks, choropleths and more.
                </p>
              </div>
            </div>
          </SubDivider>

          <SubDivider
            title="Ground Game"
            location="moonshadowmobile.com"
            link="https://moonshadowmobile.com/company/examples/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block print:space-y-1">
              <div className="lg:col-span-2 print:hidden">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/UnhP9rGa55Q?si=-okMCvZ1lUkfDct3"
                  title="Ground Game"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div>
                <p className="hidden print:block print:mb-1 print:italic print:text-gray-500">Video: youtu.be/UnhP9rGa55Q</p>
                <p>
                  Ground Game was a mobile application for iOS and Android that aided political canvassers in the field. Using the VoterMapping back-end, canvassers would fill out questionnaires and sync them back to the server.
                </p>
              </div>
            </div>
          </SubDivider>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-6 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Sean J. Hankins. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
