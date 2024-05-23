import { ListItem, Ul } from "../ui/StaticPageContainer"

const Privacy = () => {
  return (
    <>
      <h2>Cookie og privatlivspolitik</h2>
      <div>
        <div>
          <h3>Generelt</h3>
          <p>
            Ved besøg af docura.dk, simpeljura.dk samt app.docura.dk (vi kalder
            det ”platformen”) samler Docura ApS oplysninger om dig. Her kan du
            læse om, hvilke oplysninger vi indsamler, hvorfor vi gør det,
            hvordan oplysningerne bliver behandlet, hvem der kan se dem, hvor
            længe oplysningerne bliver opbevaret, og hvem du skal kontakte, hvis
            du har spørgsmål eller indsigelser angående de oplysninger, der
            bliver indsamlet.
          </p>
          <div>
            <h4>Docura indsamler oplysninger om dig på følgende måder</h4>
            <ul>
              <li>Ved brug af cookies og måling af sessions</li>
              <li>
                Ved oplysninger som er afgivet af dig ved brug af docura.dk,
                simpeljura.dk samt app.docura.dk
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h3>Cookies</h3>
          <p>
            En cookie er en lille tekstfil, der bliver gemt på din computer,
            tablet eller mobil, når du besøger en hjemmeside. Cookien indeholder
            informationer, der hjælper hjemmesiden med at genkende dig ved
            fremtidige besøg og tilpasse din oplevelse. Det kan være ting som
            sprogpræferencer, loginoplysninger eller præferencer for visning af
            indhold. Cookier bruges også til at indsamle data om din adfærd på
            hjemmesiden, hvilket hjælper ejeren med at forstå, hvordan brugerne
            interagerer med siden og forbedre brugeroplevelsen. Det er vigtigt
            at vide, at cookies kan være enten midlertidige (session-cookies)
            eller vedvarende og kan være fra hjemmesiden selv eller
            tredjeparter.
          </p>
          <div>
            <h4>Hvilke typer af cookies indsamler vi?</h4>
            <p>
              Når du besøger platformen, bruger vi 4 typer af cookies til at
              forbedre din oplevelse:
            </p>
            <Ul>
              <ListItem number={"1"}>
                <strong>Nødvendige cookies : </strong>
                Disse cookies er afgørende for at sikre, at vores hjemmesider
                fungerer korrekt og optimalt.
              </ListItem>
              <ListItem number={"2"}>
                <strong>Præference cookies : </strong>
                Disse cookies hjælper med at huske dine personlige præferencer
                på vores hjemmeside, som f.eks. placering og tidligere valg fra
                tidligere besøg.
              </ListItem>
              <ListItem number={"3"}>
                <strong>Statistiske cookies : </strong>
                Vi indsamler disse cookies for at analysere og forstå, hvordan
                vores besøgende interagerer anonymt med vores hjemmesider. Dette
                hjælper os med at optimere og måle trafikken.
              </ListItem>
              <ListItem number={"4"}>
                <strong>Marketingcookies : </strong>
                Disse cookies tillader os at tilpasse vores annoncering ved at
                indsamle oplysninger og sende relevante annoncer og kampagner på
                tværs af forskellige hjemmesider.
              </ListItem>
            </Ul>
          </div>
          <p>
            Det er muligt at slette eller blokere for cookies. Se vejledning :{" "}
            <a target="_blank" href="http://minecookies.org/cookiehandtering ">
              Se vejledning
            </a>
          </p>
        </div>
        <div>
          <h3>Personoplysninger</h3>
          <p>
            Når du anvender platformen vil vi gemme dine personoplysninger.
            Oplysninger vedrørende adresse, fødselsdagsdato og oprettelse af
            specifikke dokumenter vil blive slettet efter 3 måneder.
          </p>
        </div>
        <div>
          <h3>Sikkerhed</h3>
          <p>
            Alle dine oplysninger vil blive behandlet fortroligt og sikkert i
            overensstemmelse med gældende lovgivning, herunder navnlig
            persondataforordningen og databeskyttelsesloven.
          </p>
          <p>
            Docura ApS vil udelukkende anvende dine oplysninger til det
            oprindelige formål, som de er indsamlet til. Oplysningerne vil blive
            slettet når oplysningerne er anvendt til det bestemte formål.
          </p>
          <p>
            Vores teknologiske og organisatoriske tiltag garanterer beskyttelse
            mod utilsigtet eller ulovlig sletning, offentliggørelse, tab,
            forringelse eller uautoriseret adgang til dine oplysninger. De
            sikrer også, at oplysningerne ikke bliver misbrugt eller behandlet
            på en måde, der strider mod lovgivningen
          </p>
        </div>
        <div>
          <h3>Formål</h3>
          <p>
            Dine oplysninger anvendes med det formål at forbedre din oplevelse
            på vores hjemmeside. De bruges til at identificere dig som bruger og
            eventuelt præsentere dig for annoncer, der er relevante for dig.
            Derudover benyttes de til at levere de services, du efterspørger,
            såsom at sende dig et juridisk dokument eller minde dig om, at du
            har et juridisk dokument oprettet hos os, der er klar til at blive
            sendt. Data kan også blive brugt til at informere dig yderligere om
            indholdet af dokumentet.
          </p>
          <p>
            Uden indsamling af personlige oplysninger er vi ikke i stand til at
            levere vores service til dig.
          </p>
        </div>
        <div>
          <h3>Videregivelse af oplysninger</h3>
          <p>
            Vores hjemmeside er placeret på servere hos eksterne leverandører,
            og vi samarbejder også med tredjepartsudbydere for at drive
            hjemmesiden. Disse udbydere må ikke bruge data til deres egne
            formål.
          </p>
          <p>
            Vi videregiver kun navn, CPR-nummer og e-mailadresse med dit
            udtrykkelige samtykke.
          </p>
          <p>
            Vi benytter kun databehandlere i EU eller i lande, der kan sikre
            tilstrækkelig beskyttelse af dine oplysninger.
          </p>
        </div>
      </div>
    </>
  )
}

export default Privacy
