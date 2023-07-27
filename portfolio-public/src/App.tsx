
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
  dates: string;
  location: string;
  contact?: string;
  link?: string
};

type PointItemProps = {
  title: string,
  good: number
};

function Divider({ title }: DividerTitleProps){
  return (
    <div className="divider">
      <h3>{ title.toUpperCase() }</h3>
      <div className="line"></div>
    </div>
  );
}

function SubDivider({ children, title, dates, location, contact, link }: SubDividerProps){
  return (
    <div className="subdivider">
      <span className="dates">{ dates }</span>
      <h4>{ title }</h4>
      <div className="thin_line"></div>
      <span className="subline">
        <span className="location">
          { link ? <a href={ link } target="_blank">{ location }</a> : location }
        </span>
        <span className="contact"><a href={`tel:${contact}`}>{ contact?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') }</a></span>
      </span>
      <div className="sectionbody">{ children }</div>
    </div>
  );
}

function SmallSubDivider({ title }: DividerTitleProps) {
  return ( 
    <div className="skill_type">
        <h5>{ title.toUpperCase() }&nbsp;&nbsp;</h5>
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

function PointItem({ title, good }: PointItemProps){
  var points = [...Array(5)].map((_, ind) => {
    var name = "fa-solid fa-circle";
    if(ind < good){
      name += " strong"
    }
    return {
      name: name
    }
  });

  return (
    <div className="point_item">
      <span className="point_item_list">{ points.map((item, ind) => <i className={item.name} key={ind}></i> ) }</span>
      <span className="point_item_title">{ title }</span>
    </div>
  );
}

function Contact(){
  return (
      <div className="mycontact">
        <div><i className="fa-solid fa-at"></i> <a href="mailto:scarabdesign@gmail.com">scarabdesign@gmail.com</a></div>
        <div><i className="fa-solid fa-phone"></i> <a href="tel:5415050723">(541) 505-0723</a></div>
        <div><i className="fa-solid fa-location-dot"></i> <span>Eugene, OR</span></div>
        <div><i className="fa-brands fa-linkedin"></i> <a href="https://www.linkedin.com/in/sean-hankins" target="_blank" >linkedin.com/in/sean-hankins</a></div>
        <div><i className="fa-brands fa-github"></i> <a href="https://github.com/scarabdesign" target="_blank" >github.com/scarabdesign</a></div>
      </div>
  );
}

function Header(){
  return (
      <div className="header">
        <h2>SEAN J. HANKINS</h2>
        <span className="subtitle">Computer Programmer</span>
      </div>
  );
}

function Skills(){
  return (
    <Section name="skills">
      <div className="split_container">
        <div className="right_pane">
          <SmallSubDivider title="platforms" />
            <PointItem title="jQuery" good={5} />
            <PointItem title="Node.js / Express.js" good={4} />
            <PointItem title="ASP.NET" good={4} />
            <PointItem title="React / Vite" good={3} />
            <PointItem title="NestJS" good={3} />
          <SmallSubDivider title="storage" />
            <PointItem title="PostgreSQL" good={4} />
            <PointItem title="SQLite" good={4} />
            <PointItem title="MySQL" good={4} />
            <PointItem title="Redis" good={3} />
            <PointItem title="Azure" good={3} />
            <PointItem title="AWS" good={2} />
	    <PointItem title="MongoDB" good={2} />
          <SmallSubDivider title="os" />
            <PointItem title="Linux" good={4} />
            <PointItem title="Windows" good={4} />
            <PointItem title="Mac" good={3} />
        </div>
        <div className="left_pane">
          <SmallSubDivider title="languages" />
            <PointItem title="JavaScript" good={5} />
            <PointItem title="HTML & CSS" good={5} />
            <PointItem title="C# and .NET" good={5} />
            <PointItem title="Objective C" good={4} />
            <PointItem title="ODB2" good={3} />
            <PointItem title="Java" good={3} />
            <PointItem title="PHP" good={3} />
            <PointItem title="Python" good={2} />
            <PointItem title="Golang" good={2} />
          <SmallSubDivider title="tools" />
            <PointItem title="Visual Studio" good={5} />
            <PointItem title="VS Code" good={4} />
            <PointItem title="Eclipse" good={3} />
            <PointItem title="Photoshop" good={3} />
            <PointItem title="Git / Mercurial" good={3} />
        </div>
      </div>
    </Section>
  );
}

function Body(){
  return (
    <div className="body">
        <Section name="objective">
          <span className="textstyle">
            Seeking a challenging position in a progressive environment where I can utilize and enhance my skills as a computer programmer / application designer individually or in a team environment.
          </span>
        </Section>
        <Section name="experience">
          <SubDivider 
            title="Lead Full Stack Application Developer" 
            dates="Mar 2019 ~ Present"
            location="Perpetua Technologies, LLC"
            link="https://www.enroutepro.com/app-features"
            contact="5412552519">
              <span>Responsible for design, coding and maintenance of:</span>
              <ul>
                <li>A suite of mobile applications (Android/iOS/Windows) to support fire fighters and first-responders in the field</li>
                <li>An extensive WebSocket / RESTful API to support the mobile suite with live emergency incident data and tracking</li>
                <li>A Web based interface for higher level aspects of managing personnel and apparatus of fire/medical agencies</li>
                <li>API tools for downloading and parsing third party wildfire/hotspot datasets for on-map visualization </li>
              </ul>
          </SubDivider>
          <SubDivider 
            title="Lead Front End Application Developer" 
            dates="Nov 2007 ~ Feb 2019"
            location="Moonshadow Mobile, Inc."
            link="https://moonshadowmobile.com/"
            contact="5413434281">
              <span>Responsible for design, coding and maintenance of:</span>
              <ul>
                <li>Complex web application interfaces focusing on big data visualization and IoT</li>
                <li>A multi-platform mobile application that communicates to vehicles with OBD2 and tracks location</li>
                <li>Complex web application interfaces and API focusing on voter data, walking list creation and data analytics</li>
                <li>iOS applications used to view, gather, map and synchronize data with system servers while mobile</li>
                <li>Extensive on-line book, music and movie sales marketplace web site</li>
              </ul>
            </SubDivider>
            <div className="page_break" />
            <div className="split_container">
              <div className="right_pane">
                <SubDivider
                    title="Independent Consultant"
                    dates="Jan 2000 ~ Sep 2005"
                    location="Scarab Design"
                  >
                  <ul>
                    <li>LeadFoot Logistics: User and admin managed application</li>
                    <li>Everyone Orchestra: Design, coding, maintaining</li>
                    <li>Vision for Intact Ecosystems & Watersheds: Design, coding, maintaining</li>
                    <li>Rainbow Garden School: Design, coding, maintaining</li>
                    <li>Construction News Net: Shopping Cart system, with user and admin management</li>
                  </ul>
                </SubDivider>
              </div>
              <div className="left_pane">
                <SubDivider
                  title="Web Developer"
                  dates="Apr 2007 ~ Nov 2007"
                  location="Country Coach, International"
                  link="https://www.countrycoachclub.com"
                >
                <ul>
                  <li>Web development for a large company, designing, coding and implementing web applications and systems to facilitate manufacturing and sales of motor coaches</li>
                </ul>
                </SubDivider>
                <SubDivider
                    title="Web Developer"
                    dates="Oct 2001 ~ Oct 2002"
                    location="International Society for Technology in Education"
                    link="https://www.iste.org/"
                  >
                  <ul>
                    <li>Web development for a high traffic 2000+ page informational site for a non-profit international organization. Graphic design, applications programming and presentation</li>
                  </ul>
                </SubDivider>
                <SubDivider
                    title="AAS (Computer Programming)"
                    dates="2007"
                    location="Lane Community College"
                  >
                  <ul>
                    <li>GPA: 3.69</li>
                  </ul>
                </SubDivider>
              </div>
            </div>
        </Section>
        <Skills />
      </div>
  );
}

function Footer(){
  return (
    <div className="footer" />
  );
}

export default function Resume() {
  return (
    <div className="resume">
      <Contact />
      <Header />
      <Body />
      <Footer />
    </div>
  );
}
