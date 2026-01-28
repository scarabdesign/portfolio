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
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-slate-900 mb-2">{title}</h3>
      <div className="h-px bg-slate-300 mb-3"></div>
      <div className="flex items-center gap-2 mb-4">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            {location}
            <ExternalLink size={16} />
          </a>
        ) : (
          <span className="text-slate-600">{location}</span>
        )}
      </div>
      <div className="text-slate-700">{children}</div>
    </div>
  );
}

export default function Samples() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Portfolio Samples</h1>
          <p className="text-xl text-slate-300">Sean J. Hankins</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Independent Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            Independent Projects
          </h2>
          <p className="text-slate-700 leading-relaxed mb-8">
            Coding is my job, hobby and livelihood. Here are a few things I've created or helped to create of which I'm most proud.
          </p>

          <SubDivider
            title="Viands"
            location="github.com/scarabdesign/Viands"
            link="https://github.com/scarabdesign/Viands"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex gap-4 justify-center">
                <video width="240" height="533" controls className="rounded shadow-lg">
                  <source src="./resources/ViandsDemo2Compressed.mp4" type="video/mp4" />
                </video>
                <video width="240" height="533" controls className="rounded shadow-lg">
                  <source src="./resources/ViandsDemoCompressed.mp4" type="video/mp4" />
                </video>
              </div>
              <div>
                <p className="mb-4">
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
            location="pointlesswaste.com/chess"
            link="https://pointlesswaste.com/chess"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <img src="/resources/ChessScreen.png" className="w-full rounded shadow-lg" alt="Chess Game" />
              </div>
              <div>
                <p className="mb-4">
                  This is a simple chess application coded in React 18 with Vite and a NestJS API. I'm using a WebSocket to communicate with the chess AI Stockfish.
                </p>
                <p>
                  You can view the source code on my GitHub page:{' '}
                  <a 
                    href="https://github.com/scarabdesign/portfolio/blob/main/portfolio-public/src/chess/Chess.tsx" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <img src="/resources/MailTrashScreen.png" className="w-full rounded shadow-lg" alt="MailTrash" />
              </div>
              <div>
                <p className="mb-4">
                  Here is a sample email campaigns application that I created as a proof of concept. It's written in C# using .NET Aspire and deployed to a K8s cluster with Helm.
                </p>
                <p>
                  You can view the source code on my GitHub page:{' '}
                  <a 
                    href="https://github.com/scarabdesign/MailTrash" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    github.com/scarabdesign/MailTrash
                  </a>
                </p>
              </div>
            </div>
          </SubDivider>

        </section>

        {/* Perpetua Technologies Section */}
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            Perpetua Technologies, LLC
          </h2>

          <SubDivider
            title="EnRoutePro 4"
            location="enroutepro.com"
            link="https://www.enroutepro.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <video width="100%" controls className="rounded shadow-lg">
                  <source src="./resources/EnRoutePro4_Demo.mp4" type="video/mp4" />
                </video>
              </div>
              <div>
                <p className="mb-4">
                  Here is a quick demo of the latest EnRoutePro version in its fledgling state. It shows the basic incident list, fed by the latest emergency incidents from the state's EMS reporting system, and a details panel to give more information per incident.
                </p>
                <p className="mb-4">
                  There's also a Map Book feature that allows responders to view digitalized documents containing pertinent emergency information like fire hydrant locations and building escape plans.
                </p>
                <p className="mb-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <video width="100%" controls className="rounded shadow-lg">
                  <source src="./resources/FireAnimation.mp4" type="video/mp4" />
                </video>
              </div>
              <div>
                <p className="mb-4">
                  This is a small part of an application that helps municipal fire agencies track incidents, apparatus and personnel in active response.
                </p>
                <p className="mb-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/9QN-uOg6lnw?si=2Bu6z2F7lUXGr_ct"
                  title="ERP Demo"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div>
                <p className="mb-4">
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
        <section className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600 rounded"></div>
            Moonshadow Mobile, Inc
          </h2>

          <SubDivider
            title="DB4IoT"
            location="moonshadowmobile.com"
            link="https://moonshadowmobile.com/"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/ysnUElHeZw0?si=TCpNlrc8Ao76r-u0"
                  title="DB4IoT Demo"
                  allowFullScreen
                  className="rounded shadow-lg"
                />
              </div>
              <div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
                <p>
                  Ground Game was a mobile application for iOS and Android that aided political canvassers in the field. Using the VoterMapping back-end, canvassers would fill out questionnaires and sync them back to the server.
                </p>
              </div>
            </div>
          </SubDivider>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Sean J. Hankins. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}