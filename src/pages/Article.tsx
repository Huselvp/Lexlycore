import styled from "styled-components"
import Header from "../ui/Header"
import Footer from "../ui/Footer"
import { Navigate, useParams } from "react-router-dom"
import { useScrollToTop } from "../hooks/useScrollToTop"

const Container = styled.div`
  max-width: 80rem;
  margin: 5rem auto 15rem;
  padding: 0 2rem;
  & > h1 {
    margin-bottom: 5rem;
    font-weight: 700;
    font-size: 4.2rem;
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    font-size: 1.8rem;
    & > section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      & strong {
        font-weight: 600;
      }
      & h3 {
        font-size: 2.4rem;
      }
      & h4 {
        font-size: 2rem;
        font-weight: 600;
      }
      & a {
        color: var(--color-blue-500);
        font-weight: 500;
        font-size: 1.4rem;
        text-decoration: underline;
      }
    }
    & ul {
      padding: 0.5rem 0 0.5rem 4rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      list-style: disc;
    }
  }
`
const isArticleValid = (article: string | undefined) =>
  [
    "gensidigt-testamente",
    "familietestamente",
    "anfordringslån",
    "lejekontrakt"
  ].some((item) => item === article)

const Article = () => {
  const { article } = useParams()
  useScrollToTop()
  if (!isArticleValid(article)) return <Navigate to="/pageNotFound" />
  if (article === "gensidigt-testamente")
    // mutual-wills
    return (
      <>
        <Header />
        <Container>
          <h1>Gensidigt testamente</h1>
          <div>
            <section>
              <h3>Samlevende</h3>
              <p>
                Et gensidigt testamente, også betegnet som et
                samlevertestamente, repræsenterer et retligt dokument, der
                sædvanligvis udarbejdes af et ugift par med det formål at sikre
                hinandens økonomiske og arvemæssige interesser i tilfælde af den
                ene partners bortgang. Dette dokument er særligt relevant for
                ugifte par, der ønsker at etablere klare juridiske
                retningslinjer for at sikre visse rettigheder og arverettigheder
                til hinanden, og som derfor vælger at formalisere deres
                gensidige forpligtelser vedrørende formue og arv gennem denne
                kontraktlige aftale.
              </p>
              <p>
                Et gensidigt testamente udgør en retlig kontrakt, der potentielt
                indeholder en række klausuler, primært til fordel for den
                længstlevende partner. Nogle af de hyppigt anvendte bestemmelser
                inkluderer:
              </p>
              <ul>
                <li>
                  <strong>Arv: </strong>
                  Parterne kan præcist specificere, at den længstlevende partner
                  skal arve hele eller en del af den afdøde parts formue. Dette
                  omfatter ejendom, bankkonti, investeringer og andre aktiver.
                </li>
                <li>
                  <strong>Uskiftet bo: </strong>
                  En aftale kan indgås, hvori den længstlevende partner bevares
                  retten til at forblive i den fælles bopæl uden tvang til at
                  dele ejendommen med arvinger fra den afdøde partner.
                </li>
                <li>
                  <strong>Testamente til fordel for fælles børn: </strong>
                  Særligt hvis der er fælles børn, kan der oprettes en
                  bestemmelse, der sikrer, at den længstlevende partner bevarer
                  både forældremyndighed og økonomisk ansvar for børnene efter
                  den anden partners død.
                </li>
                <li>
                  <strong>Begrænsning af andre arvingers rettigheder: </strong>
                  Der kan aftales klausuler, der begrænser visse arvingers
                  rettigheder, såsom tidligere ægtefæller eller
                  familiemedlemmer, og udelukker dem fra arveret i forhold til
                  den længstlevende partner.
                </li>
              </ul>
              <p>
                Et gensidigt testamente kan ikke erstatte de juridiske
                rettigheder, der udspringer af et ægteskab. På denne baggrund
                bør det overvejes at indgå et ægteskab, hvis man ønsker
                fuldstændig retssikkerhed og fordele.
              </p>
              <h4>Samlevende, der har fællesbørn</h4>
              <p>
                I mangel af et gensidigt testamente vil ugifte samlevende ikke
                have arveret efter hinanden, uanset om de har fælles børn eller
                ej. Uden dette juridiske dokument vil afdødes formue fordeles i
                henhold til arveloven, hvilket potentielt kan udelukke den
                overlevende partner som arving. Ved at udarbejde et gensidigt
                testamente kan samlevende par imidlertid sikre, at den
                længstlevende partner modtager op til 87,5 % af den afdødes arv.
              </p>
            </section>
            <section>
              <h3>Ægtefæller, der har fællesbørn</h3>
              <p>
                I mangel af et gensidigt testamente vil ægtefæller med fælles
                børn ikke arve hele formuen efter hinanden. Ifølge arveloven vil
                den længstlevende ægtefælle arve 50 % af formuen, mens de
                resterende 50 % vil tilfalde afdødes børn. Ved at udarbejde et
                gensidigt testamente kan ægtefæller imidlertid sikre, at op til
                87,5 % af arven tildeles den længstlevende ægtefælle.
              </p>
              <p>
                Dette juridiske dokument giver ægtefæller mulighed for at
                præcisere, hvordan de ønsker at fordele deres formue ved den ene
                parts bortgang. Ved at inkludere specifikke bestemmelser kan
                ægtefællerne sikre, at den længstlevende modtager en større
                andel af arven og dermed opnår økonomisk sikkerhed. Det
                gensidige testamente fungerer således som et redskab til at
                tilpasse arveforholdene ud over det, der automatisk fastsættes
                af loven.
              </p>
            </section>
            <section>
              <h3>Ægtefæller, der har særbørn</h3>
              <p>
                I mangel af et gensidigt testamente vil ægtefæller med særbørn
                arve 50 % af formuen efter den afdøde ægtefælle, mens afdødes
                børn også vil arve 50 %. Den længstlevende ægtefælle kan blive
                pålagt at udbetale arv til afdødes børn, hvilket kan medføre
                komplekse juridiske forhold. Ved at etablere et gensidigt
                testamente kan ægtefællerne dog sikre, at den længstlevende
                ægtefælle modtager op til 87,5 % af arven.
              </p>
              <p>
                Det skal også bemærkes, at afdødes særbørn har ret til at kræve
                udbetaling af arv umiddelbart efter forældrenes død og kan også
                nægte den længstlevende at forblive i uskiftet bo. Boet skal
                derfor skiftes, før arven udbetales.
              </p>
            </section>
            <section>
              <h3>Overvejelser i forbindelse med et gensidigt testamente</h3>
              <p>
                Før beslutningen om at oprette et gensidigt testamente træffes,
                kan det være hensigtsmæssigt at overveje flere forskellige
                faktorer. Disse overvejelser kan omfatte:
              </p>
              <ul>
                <li>
                  <strong>Arvefordeling til den længstlevende: </strong>
                  Skal den længstlevende ægtefælle arve hele formuen eller
                  maksimalt beløb efter den førstafdøde ægtefælle?
                </li>
                <li>
                  <strong>Arving til den længstlevende: </strong>
                  Hvem skal være arving til den længstlevende partner, og
                  hvordan skal denne fordeling struktureres?
                </li>
                <li>
                  <strong>Arvefordeling i mangel af børn: </strong>
                  Hvis der ikke er fælles børn, skal arven fordeles ligeligt
                  mellem slægtninge?
                </li>
                <li>
                  <strong>Arvefordeling med børn: </strong>I tilfælde af fælles
                  børn, skal arven fordeles lige blandt dem eller i mindst mulig
                  grad?
                </li>
                <li>
                  <strong>
                    Ønsker om at begunstige specifikke personer eller
                    organisationer:
                  </strong>
                  Har I ønsker om at begunstige navngivne personer eller
                  organisationer i arvefordelingen?
                </li>
                <li>
                  <strong>
                    Ønske om at gøre arven til særeje for arvingerne:
                  </strong>
                  Ønsker I, at arven fra jer til jeres arvinger skal behandles
                  som særeje?
                </li>
              </ul>
              <p>
                At tage stilling til disse spørgsmål inden oprettelsen af et
                gensidigt testamente kan hjælpe med at skabe klarhed og sikre,
                at dokumentet afspejler nøjagtigt, hvordan I ønsker at fordele
                jeres formue.
              </p>
            </section>
            <section>
              <h3>Tilbagekaldelse af et gensidigt testamente</h3>
              <p>
                I tilfælde af ønsket om at tilbagekalde et gensidigt testamente,
                der tidligere er oprettet med for eksempel en samlever eller
                ægtefælle, er det afgørende at informere den anden part om
                tilbagekaldelsen. Dette kræver en meddelelse, som af
                bevismæssige hensyn bør foretages ved anvendelse af brev.
              </p>
              <p>
                Tilbagekaldelse af et gensidigt testamente kan imidlertid
                ophæves ved enten at udarbejde et nyt testamente foran en notar
                eller ved at ophæve det eksisterende gensidige testamente hos
                notaren. Hos notaren udfyldes en specifik blanket, der formelt
                ophæver det tidligere oprettede gensidige testamente.{" "}
              </p>
            </section>
          </div>
        </Container>
        <Footer />
      </>
    )
  if (article === "familietestamente")
    // family-wills
    return (
      <>
        <Header />
        <Container>
          <h1>Familietestamente</h1>
          <div>
            <section>
              <h3>Fordelene ved at oprette et testamente</h3>
              <p>
                Når man ikke opretter et testamente, bliver ens arv automatisk
                fordelt i overensstemmelse med arvelovens bestemmelser. Ifølge
                denne lov går arven primært til ægtefællen og livsarvinger. Ved
                at oprette et testamente kan man dog ændre på dette. Eksempelvis
                kan man inkludere sin partner eller en ven som arving. Det er
                dog vigtigt at bemærke, at visse regler omkring tvangsarv ikke
                kan omgås. Du kan dog oprette et testamente, hvor du testerer
                over friarven, uanset sammensætning af din familie – om du er
                gift, samlevende, enlig eller har børn.
              </p>
            </section>
            <section>
              <h3>Livsarvinger og særbørn</h3>
              <p>
                Livsarvinger inkluderer børn og børnebørn, både biologiske og
                adopterede. Disse er de eneste, der er garanteret arv ifølge
                tvangsarven. Særbørn, hvor kun den ene ægtefælle eller samlever
                er forælder, har ikke automatisk ret til arv, men dette kan
                ændres gennem et familietestamente.
              </p>
            </section>
            <section>
              <h3>Uskiftet bo</h3>
              <p>
                At sidde i uskiftet bo betyder, at den længstlevende ægtefælle
                får lov til at disponere over den afdøde ægtefælles formue uden
                umiddelbart at dele den med andre arvinger. Arven vil først
                blive delt, når den længstlevende ægtefælle dør.
              </p>
              <p>
                Den overlevende ægtefælle har lov til at forblive i uskiftet bo
                med fællesbørnene. Dette princip gælder dog ikke for den afdøde
                ægtefælles. I sådanne tilfælde er det nødvendigt med direkte
                godkendelse fra særbørnene. Hvis dette samtykke ikke er blevet
                givet, vil arven blive uddelt.{" "}
              </p>
            </section>
            <section>
              <h3>Tvangsarv</h3>
              <p>
                Uanset testamente kan visse arvelovsregler ikke omgås, navnlig
                tvangsarven. Livsarvinger har ret til en kvote (25%) af arven,
                mens resten kan testamentes efter eget ønske. Hvis den afdøde
                ikke har børn, børnebørn eller oldebørn, altså livsarvinger, kan
                der testamenteres over hele arven.{" "}
              </p>
            </section>
            <section>
              <h3>Arveklasser</h3>
              <p>
                Arveloven inddeler arvingerne i tre klasser. Arven fordeles
                først til den nærmeste klasse, og hvis der ikke er nogen i denne
                klasse, går den videre til den næste:
              </p>
              <ul>
                <li>
                  <strong>Første arveklasse:</strong>
                  Denne klasse inkluderer ægtefælle og livsarvinger (børn,
                  børnebørn og oldebørn).
                </li>
                <li>
                  <strong>Anden arveklasse:</strong>
                  Denne klasse inkluderer forældre og derefter søskende. Det er
                  forældre, der har førsteret til arven, hvor halvdelen af hver
                  arv fordeles mellem dem. Hvis forældrene ikke er i live, vil
                  arven tilfalde søskende.{" "}
                </li>
                <li>
                  <strong>Tredje arveklasse:</strong>
                  Denne klasse inkluderer bedsteforældre og derefter andre nære
                  slægtninge som mostre, fastre, farbrødre og morbrødre.
                  Bedsteforældre har førsteret til arven, hvor bedsteforældre på
                  hver forældres side vil arve ligeligt. Derefter vil mostre,
                  fastre, farbrødre og morbrødre arve ligeligt, hvis
                  bedsteforældrene er afgået ved døden.{" "}
                </li>
              </ul>
            </section>
            <section>
              <h3>Bemærkninger vedrørende familietestamente</h3>
              <p>
                For at oprette et familietestamente skal man være mindst 18 år
                og i stand til at træffe fornuftige beslutninger, altså handle
                ”fornuftsmæssigt”. Det er vigtigt at forstå, at dette testamente
                er et "notartestamente", som skal underskrives hos en notar ved
                en af landets byretter, førend det er gyldigt.{" "}
              </p>
            </section>
            <section>
              <h3>Hvordan kan Docura hjælpe?</h3>
              <p>
                Docura tilbyder vejledning og assistance med oprettelse af
                familietestamente. Med vores intelligente dokumentgenerator kan
                vi skræddersy et familietestamente efter dine behov. Du besvarer
                blot en række spørgsmål i dokumentgeneratoren, hvorefter din
                aftale er klar til digital underskrivning og download.
              </p>
            </section>
          </div>
        </Container>
        <Footer />
      </>
    )
  if (article === "anfordringslån")
    // Demain-loans
    return (
      <>
        <Header />
        <Container>
          <h1>Anfordringslån</h1>
          <div>
            <section>
              <h3>Anfordringslån</h3>
              <p>
                Ved et anfordringslån kan långiver opsige låneaftalen når som
                helst. Dette lån er normalt uden renter og kan opsiges helt
                eller delvist inden for en kort periode. Anfordringslån bruges
                typisk mellem nærtstående personer, som for eksempel børn,
                ægtefæller eller venner, fordi lånet tilbydes på meget favorable
                betingelser.
              </p>
            </section>
            <section>
              <h3>Kort introduktion til anfordringslån</h3>
              <p>
                Anfordringslån er en særlig form for lån, ofte brugt mellem
                familiemedlemmer. Det er tæt knyttet til familielån og etableres
                sædvanligvis helt rente- og gebyrfrit. Långiver og låntager kan
                selv aftale de nærmere betingelser for tilbagebetaling, men det
                er vigtigt at være opmærksom på, at lånet kan kræves
                tilbagebetalt med kort varsel. Det er en særlig fleksibel
                låntype, da det bl.a. heller ikke er nødvendigt for låntager at
                stille sikkerhed (f.eks. ved kautionist eller ved at pantsætte
                sine ejendele). Der eksisterer ikke nogen formelle betingelser
                for udarbejdelse af gældsbrevet, men det er aldeles
                hensigtsmæssigt at dokumentere lånet ved skriftlig aftale. Det
                er derfor vigtigt at have styr på de relevante aftalepapirer.{" "}
              </p>
            </section>
            <section>
              <h3>Hvad er særligt ved et anfordringslån?</h3>
              <p>
                Generelt er der ingen faste vilkår for anfordringslån, men det
                stilles ofte som betingelse, at lånet tilbagebetales inden for
                en forholdsvis kort periode, f.eks. inden for 12 måneder. En
                skriftlig aftale i form af et anfordringsgældsbrev kan præcisere
                betingelserne, og det er typisk en forudsætning, at låntager har
                en stabil indkomst. Der er ingen øvre grænse for lånebeløbets
                størrelse.
              </p>
            </section>
            <section>
              <h3>Hvilke fordele er der ved at tage et anfordringslån?</h3>
              <p>
                Anfordringslån er attraktive på grund af at det er rente- og
                gebyrfrit og at man har muligheden for selv at aftale de nærmere
                tilbagebetalingsvilkår. Der er som udgangspunkt heller ikke
                andre omkostninger forbundet med lånet såsom skatter eller
                afgifter. Denne frihed til selv at aftale vilkårene er dermed
                også forbundet med en væsentlig usikkerhed. Det er derfor
                vigtigt at have en skriftlig aftale for at undgå denne
                usikkerhed og sikrer alle betingelserne i lånet.
              </p>
            </section>
            <section>
              <h3>Hvad skal man være særligt opmærksom på?</h3>
              <p>
                Hvis du overvejer at låne til familiemedlemmer, er det vigtigt
                at kende reglerne for nedskrivning for at undgå gaveafgift.
                Gaveafgiften kan undgås ved at modregne lånet hvert år til et
                specifikt beløb. For at undgå at skulle betale skat, er det
                muligt at nedskrive med 74.100 kr. (2024-sats). Satsen ændres
                hvert år og kan ses på{" "}
                <a
                  target="_blank"
                  href="https://skat.dk/borger/gaver-gevinster-og-legater/gaver-saa-meget-maa-du-give"
                >
                  SKATs hjemmeside
                </a>
                {" ."}
              </p>
              <p>
                Der er enkelte betingelser, som skal være opfyldt før en
                låneaftale, er gyldig:
              </p>
              <ul>
                <li>
                  Der skal aftales en frist for tilbagebetalingen, såfremt
                  långiver anmoder om at få tilbagebetalt lånet.
                </li>
                <li>
                  Det må ikke (skriftligt) aftales, at I har aftalt en specifik
                  nedskrivning hvert år, eftersom det kan medføre
                  gavebeskatning.
                </li>
              </ul>
              <p>
                Lånet forfalder sædvanligvis også til betaling i tilfælde af
                dødsfald.
              </p>
              <p>
                På denne baggrund anbefales det, at der udarbejdes et
                anfordringsgældsbrev for at sikre, at alle juridiske rammer og
                forpligtelser respekteres og efterleves. Derudover tilbyder
                Docura flere forskellige muligheder til betalings- og
                tilbagebetalingsmåden. Der gælder ingen særlige formkrav, men
                det er særligt hensigtsmæssigt, at lånet nedfældes på skrift som
                dokumentation, hvis SKAT anmoder herom.
              </p>
            </section>
            <section>
              <h3>Renter i anfordringslån?</h3>
              <p>
                Anfordringslån aftales ofte således, at de er rentefrie, men det
                kan variere. Hvis der pålægges renter, skal det aftales på
                forhånd, og renterne skal indberettes til skattevæsenet. Såfremt
                der aftales påløbne renter, betales disse ofte løbende og ikke
                samlet ved lånets udløb. Renterne kan aftales som værende faste
                eller variable. Overvej omhyggeligt, da renter kan komplicere
                processen og medføre ekstra omkostninger for långiver i form af
                skat på modtagne rentebetalinger.
              </p>
            </section>
            <section>
              <h3>Sådan sætter du i gang</h3>
              <p>
                Du kan oprette dit eget anfordringsgældsbrev hos Docura ved brug
                af vores dokumentgenerator. Besvar nogle spørgsmål, og dit
                dokument er klar til digital underskrift og download eller
                modtag på mail, eller download til fysisk underskrift. Sidder du
                inde med spørgsmål vedrørende processen eller øvrige
                henvendelser står vi til rådighed på telefonen, mail eller
                chatfunktionen.
              </p>
            </section>
          </div>
        </Container>
        <Footer />
      </>
    )
  if (article === "lejekontrakt")
    // Lease
    return (
      <>
        <Header />
        <Container>
          <h1>Lejekontrakt</h1>
          <div>
            <section>
              <h3>Hvorfor Er en Skriftlig Lejekontrakt Viktig?</h3>
              <p>
                Det er vigtigt at indgå en skriftlig lejekontrakt ligesom det er
                tilfældet med andre juridiske aftaler. Lejekontrakten udgør
                grundlaget for hele lejeforholdet, da den fastlægger
                betingelserne for en lejeaftale mellem to parter. Det er i
                lejekontrakten, at parterne kan fastlægge, hvordan forholdene
                omkring aftalen skal være, herunder parternes rettigheder og
                forpligtelser. Hvis der opstår uenighed under lejeperioden, er
                det også lejekontrakten, som bliver anvendt til at løse
                konflikten. Derfor betragtes udfærdigelsen af lejekontrakten som
                det allervigtigste i forbindelse med en lejeaftale.
              </p>
            </section>
            <section>
              <h3>Derfor er det vigtigt med en lejekontrakt</h3>
              <p>
                Lejekontrakten er en afgørende del af aftalen, da det er denne
                kontrakt, der definerer de rettigheder og forpligtelser, som
                begge parter har i lejeforholdet. Boligministeriet har
                udarbejdet en standardkontrakt, kendt som typeformular A9, som
                også kan bruges ved indgåelse af lejeaftaler. Denne
                standardkontrakt dækker de vigtigste punkter og sikrer, at alle
                relevante emner bliver taget i betragtning i lejeforholdet.
              </p>
              <p>
                Ikke desto mindre er der også nogle særlige forhold, som man
                skal være opmærksom på ved udarbejdelsen af en lejekontrakt. Et
                af disse punkter er § 11 i kontrakten, hvor særlige vilkår for
                lejeaftalen kan angives. Dette betyder, at der er mulighed for
                at fravige de standardiserede vilkår og formulere individuelle
                aftaler til fordel eller ulempe for begge parter. Hvis man som
                lejer har at gøre med en erfaren udlejer, er det værd at give
                dette punkt ekstra opmærksomhed. Det er under § 11, at
                bestemmelser om huslejestigninger, husorden og lignende kan
                indføres.
              </p>
            </section>
            <section>
              <h3>Særlige forhold under § 11</h3>
              <p>
                De første 10 punkter i typeformular A9 er standardbestemmelser
                på baggrund af de almindelige regler i lejeloven. I punkt § 11
                skal udlejeren angive specifikke vilkår for lejeforholdet. Disse
                vilkår kan begrænse lejerens rettigheder eller pålægge mere
                omfattende forpligtelser.{" "}
              </p>
              <p>
                Som lejer eller udlejer, er det derfor vigtigt at være opmærksom
                på dette og sikre gyldigheden af punkt § 11. Som eksempler på
                ugyldige aftalte betingelser, kan være at udlejer pålægger
                lejeren åbenlyse urimelige vilkår. Ofte aftales det i § 11, at:
              </p>
              <ul>
                <li>
                  Aftalen er tidsbegrænset og lejeaftalen ophører på en nærmere
                  angivet dato, hvilket dog kræver en særlig grund, f.eks. at
                  man vender retur fra forretningsrejse eller udvekslingsophold,
                  mv.,
                </li>
                <li>
                  At udlejer er berettiget til at regulere lejen på årlig basis
                  i medfør af samfundets prisudvikling, hvilket kaldes
                  nettoprisindekset,
                </li>
                <li>
                  At der skal gælde en særlig vedligeholdelsespligt for lejer
                </li>
              </ul>
            </section>
            <section>
              <h3>Lejekontraktens indhold</h3>
              <p>
                Lejekontrakten rummer en del bestemmelser, hvor de oftest
                forekommende er:
              </p>
              <ul>
                <li>Informationer om udlejer og lejer</li>
                <li>Tidspunkt for påbegyndelsen af lejeforholdet</li>
                <li>Opsigelsesvarsel</li>
                <li>
                  Lejemålets type, f.eks. et værelse, hele lejligheden, mv.
                </li>
                <li>Lejemålets størrelse (areal)</li>
                <li>
                  Brugsret til fællesområder, f.eks. adgang til vaskerum,
                  parkeringskælder, kælderrum, mv.
                </li>
                <li>Huslejens størrelse samt depositum og forudbetalt leje</li>
                <li>
                  Oplysninger om lejemålets stand ved tidspunktet for
                  indflytning
                </li>
                <li>
                  Aftaler vedrørende forbrugsomkostninger, f.eks. el, vand og
                  varme
                </li>
                <li>Øvrige aftaler vedrørende veligeholdelse</li>
              </ul>
            </section>
            <section>
              <h3>Hvordan Hjælper Lexly med Lejekontrakt?</h3>
              <p>
                Selvom der er en standardformular, er det en god idé at få
                professionel hjælp til at tilpasse kontrakten efter parternes
                behov. Hos Lexly hjælper vi med at oprette eller gennemgå
                lejekontrakter. Vores eksperter i lejeret tilbyder skræddersyet
                rådgivning og tager hensyn til intentionerne og formålet med
                lejeforholdet.
              </p>
            </section>
            <section>
              <h3>Hjælp til oprettelse af en lejekontrakt</h3>
              <p>
                Man kan sidde med en fornemmelse af, at det simpelt og lige til
                at udarbejde en lejekontrakt, især når en standardformular fra
                Boligministeriet er tilgængeligt for alle. Det skal dog
                bemærkes, at standardformularen primært fungerer som en
                vejledning og ikke tager hensyn til parternes specifikke
                intentioner og formål med lejeforholdet. Docura tilbyder
                oprettelsen af skræddersyede lejekontrakter, som tager højde for
                netop dit konkrete behov.
              </p>
            </section>
          </div>
        </Container>
        <Footer />
      </>
    )
}

export default Article
