import Footer from "../ui/Footer"
import Header from "../ui/Header"
import Hero from "../ui/Home Sections/Hero"
import VideoSection from "../ui/Home Sections/VideoSection"
import styled from "styled-components"
import Section1 from "../ui/Home Sections/Section1"
import Section2 from "../ui/Home Sections/Section2"
import Articles from "../ui/Home Sections/Articles"
import Cta from "../ui/Home Sections/Cta"

const Content = styled.div`
  /* background-color: var(--white); */
  & h2 {
    font-size: 2.8rem;
    font-weight: 600;
    text-align: center;
  }
`
const articles = [
  {
    img: "https://www.legaldesk.dk/media/sxam4vdf/krav-til-ansaettelseskontrakt_legaldesk_17052022.jpg",
    title: "Anfordringslån",
    link: "anfordringslån",
    description:
      "Nysgerrig på anfordringslån? Udforsk den fleksible, rentefri udlånsmulighed med mulighed for opsigelse når som helst."
  },
  {
    img: "https://www.legaldesk.dk/media/balo22z4/cvr-nummer-til-forening_legaldesk_17052022.jpg",
    title: "Lejekontrakt",
    link: "lejekontrakt",
    description:
      "Hvorfor er en skriftlig lejekontrakt afgørende for din lejeaftale? Opdag dens nøglerolle i at definere vilkår, rettigheder og forpligtelser i forholdet mellem udlejer og lejer."
  },
  {
    img: "https://www.legaldesk.dk/media/0hfnzezm/aegtepagt-om-saereje_legaldesk_17052022.jpg",
    title: "Familietestamente",
    link: "familietestamente",
    description:
      "Hvorfor er det vigtigt for alle familier at have et testamente? Opdag fordelene ved et familietestamente og hvordan det giver dig mulighed for at tilpasse din arv."
  },
  {
    img: "https://www.legaldesk.dk/media/oosl1ge5/selskabsaendringer_legaldesk_17052022.jpg",
    title: "Gensidigt testamente",
    link: "gensidigt-testamente",
    description:
      "Hvorfor er et gensidigt testamente vigtigt for ugifte par? Opdag, hvordan dette juridiske dokument beskytter økonomiske interesser og giver klarhed og sikkerhed for partnere."
  }
]

const data2 = [
  {
    title: "Dokument til 279 kr",
    description:
      "Få udarbejdet et dokument til en gennemsnitlig pris på kun 279 kr. Ved brug af vores produkter opnår du en gennemsnitlig besparelse på mellem 2.200 – 4.500 kr. sammenlignet med en almindelig advokat",
    icon: "money.svg"
  },
  {
    title: "Modtag dokumentet på få minutter",
    description:
      "I gennemsnit tager det kun mellem 10-15 minutter at udfylde formularen til at du modtager dit dokument.",
    icon: "stopwatch.svg"
  },
  {
    title: "Bevar kvaliteten",
    description:
      "Få et skræddersyet dokument til netop dit konkrete behov. Du får samme kvalitet og sikkerhed, dog til en brøkdel af prisen. Der er adgang til vejledning gennem vores kompetente og hjælpsomme kundesupport",
    icon: "sliders.svg"
  }
]
const data1 = [
  {
    title: "Sikkert og trygt",
    description:
      "Vi sørger for at opbevare dine oplysninger fortroligt, og alle dine data er krypteret i vores servere, som er placeret i EU. Docura sikrer overholdelsen af de gældende databeskyttelsesregler",
    icon: "secure.svg"
  },
  {
    title: "Transparente priser ",
    description:
      "I vores dokumentkatalog kan du altid finde faste, transparente priser og nærmere information, inden du opretter et dokument",
    icon: "handshake.svg"
  },
  {
    title: "Tilfredshedsgaranti",
    description:
      "Vi bestræber os på at opnå 100% kundetilfredshed. Vi står til rådighed for at besvare alle henvendelser på chat, mail eller telefon i tilfælde af spørgsmål, eller mod forventning er utilfreds med produktet",
    icon: "star.svg"
  }
]

const Home = () => {
  return (
    <>
      <Header />
      <Content>
        <main>
          <Hero />
          <VideoSection />
          <Section1 data={data1} includeHeading={false} />
          <Section2 />
          <Articles data={articles} />
          <Section1 data={data2} includeHeading={true} />
          <Cta />
          <div style={{ marginBottom: "15rem" }}></div>
        </main>
      </Content>
      <Footer />
    </>
  )
}

export default Home
