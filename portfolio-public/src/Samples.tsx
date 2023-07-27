
type DividerTitleProps = {
    title: string
}

type DividerProps = { 
    children: React.ReactNode, 
    name: string 
};

type SubDividerProps = { 
    children: React.ReactNode;
    title: string;
    location: string;
    contact?: string;
    link?: string
};  

function Divider({ title }: DividerTitleProps){
    return (
        <div className="divider">
            <h3>{ title.toUpperCase() }</h3>
            <div className="line"></div>
        </div>
    );
}

function Section({ children, name }: DividerProps){
    return (
        <>
            <Divider title={name} />
            <div className="section" id={ name }>
                { children }
            </div>
        </>
    );
}

function SubDivider({ children, title, location, link }: SubDividerProps){
    return (
      <div className="subdivider">
        <h4>{ title }</h4>
        <div className="thin_line"></div>
        <span className="subline">
          <span className="location">
            { link ? <a href={ link } target="_blank">{ location }</a> : location }
          </span>
        </span>
        <div className="sectionbody">{ children }</div>
      </div>
    );
  }

export default function Samples() {
    return <div className="resume">
        <div className="header">
            <h2>Samples</h2>
            <span className="subtitle">Sean J. Hankins</span>
        </div>
        <Section name={"Independent"} >
            <span className="textstyle">
                Coding is my job, hobby and livelihood. Here are a few things I've created or helped to create of which I'm most proud.
            </span>
            <SubDivider title="Viands" location="github.com/scarabdesign/Viands" link="https://github.com/scarabdesign/Viands">
                <div className="threeway_split_container">
                    <div className="right_pane">
                        <video width="240" height="533" controls className="inline_video">
                            <source src="./public/resources/ViandsDemo2Compressed.mp4" type="video/mp4"/>
                        </video>
                    </div>
                    <div className="right_pane">
                        <video width="240" height="533" controls className="inline_video">
                            <source src="./public/resources/ViandsDemoCompressed.mp4" type="video/mp4"/>
                        </video>
                    </div>
                    <div className="left_pane">
                        <p>Personalized shopping list program written with .NET8 MAUI Blazor and an SQLite store. The back-end API was written with NestJS/NodeJs/ExpressJS with a PostgreSQL store.</p>
                        <p>Viands is an suite of applications for Windows, iOS and Android (more platforms to come) that allows a user to add products and line items to shopping lists and mark them off as they shop. Also boasts a barcode scanner for easy product additions and a cloud backup scheme.</p>
                    </div>
                </div>
            </SubDivider>
            <SubDivider title="Chess" location="pointlesswaste.com/chess" link="http://www.pointlesswaste.com/chess">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <img src="/public/resources/ChessScreen.png" width="510" />
                    </div>
                    <div className="left_pane">
                        <p>This is a simple chess applications coded in React 18 with Vite and a NestJS API. I'm using a WebSocket to communicate with the chess AI Stockfish.</p>
                        <p>You can view the source code on my GitHub page: <a href="https://github.com/scarabdesign/portfolio/blob/main/portfolio-public/src/chess/Chess.tsx" target="_blank">github.com/scarabdesign/portfolio</a>.</p>
                    </div>
                </div>
            </SubDivider>
        </Section>
        <Section name={"Perpetua Technologies, LLC"} >
            <SubDivider title="Active Fire Animations" location="enroutepro.com" link="https://www.enroutepro.com/">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <video width="645" height="359" controls>
                            <source src="./public/resources/FireAnimation.mp4" type="video/mp4"/>
                        </video>
                    </div>
                    <div className="left_pane">
                        <p>This is a small part of an application that helps municipal fire agencies track incidents, apparatus and personnel in active response.</p>
                        <p>The video on the right is an animation of part of the 2023 Bedrock fire east of Eugene/Springfield. The data is from stored fire hotspot sources from NASA (MODIS/VIIRS/GOES), and the outline is the InciWeb boundary for the fire.</p>
                        <p>The tool animates over buckets of time slots per day. The color of the points reflects the relative hotspot temperatures and the dark shapes are the affected ("burned") areas.</p>
                    </div>
                </div>
            </SubDivider>
            <SubDivider title="EnroutePro 3" location="enroutepro.com" link="https://www.enroutepro.com/">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <iframe width="560" height="315" 
                        src="https://www.youtube.com/embed/9QN-uOg6lnw?si=2Bu6z2F7lUXGr_ct" 
                        title="ERP Demo" allowFullScreen />
                    </div>
                    <div className="left_pane">
                        <p>EnroutePro is a suite of mobile applications used by fire agencies to track and manage active fire/medical incidents. 
                            The application is supported on Windows, iOS and Android and is intended to be installed on devices in the emergency vehicles and personal phones. 
                            The clients communicate to the ERP API servers with Web Sockets and POST/GET requests.</p>
                        <p>There is also a management back-end that allows managers to remotely assign and track responders. </p>
                    </div>
                </div>
            </SubDivider>
        </Section>
        <Section name={"Moonshadow Mobile, Inc"} >
            <SubDivider title="DB4IoT" location="moonshadowmobile.com" link="https://moonshadowmobile.com/">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <iframe width="560" height="315" 
                        src="https://www.youtube.com/embed/ysnUElHeZw0?si=TCpNlrc8Ao76r-u0" 
                        title="DB4IoT Demo" allowFullScreen />
                    </div>
                    <div className="left_pane">
                        <p>Db4IoT is a product used by any organization or government entity who needs to collect and analyze traffic
                        patters and visualize big data sets on maps and graphs. My part in the team was mostly the front-end interface 
                        the users see as well as some management back-end functionality and other services.</p>
                    </div>
                </div>
            </SubDivider>
            <SubDivider title="VoterMapping" location="moonshadowmobile.com" link="https://moonshadowmobile.com/company/examples/">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <iframe width="560" height="315" 
                        src="https://www.youtube.com/embed/o1_gCiRy8GM?si=dDrw2VPppUL4_bB0" 
                        title="VoterMapping" allowFullScreen />
                    </div>
                    <div className="left_pane">
                        <p>VoterMapping was a web application that tracked public voter history and visualized them over maps. Tools allowed users to 
                            do analysis, draw walking lists, draw bounding shapes, masks, choropleths and more.
                        </p>
                    </div>
                </div>
            </SubDivider>
            <SubDivider title="Ground Game" location="moonshadowmobile.com" link="https://moonshadowmobile.com/company/examples/">
                <div className="threeway_split_container">
                    <div className="right_two_panes">
                        <iframe width="560" height="315" 
                        src="https://www.youtube.com/embed/UnhP9rGa55Q?si=-okMCvZ1lUkfDct3" 
                        title="Ground Game" allowFullScreen />
                    </div>
                    <div className="left_pane">
                        <p>Ground Game was a mobile application for iOS and Android that aided political canvassers in the field. Using the VoterMapping 
                            back-end, canvassers would fill out questionnaires and sync them back to the server.</p>
                    </div>
                </div>
            </SubDivider>
        </Section>
    </div>
}