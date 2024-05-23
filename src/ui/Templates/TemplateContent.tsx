import styled from "styled-components"
import { useTemplate } from "../../features/Templates/useTemplate"

const Container = styled.div`
  grid-row: 2/3;
  grid-column: 1/2;
  & h1 {
    font-weight: 600;
    font-size: 3.5rem;
  }
  & h2 {
    font-weight: 600;
    font-size: 3rem;
  }
  & h3 {
    font-weight: 500;
    font-size: 3rem;
  }
  & h4 {
    font-weight: 500;
    font-size: 2.5rem;
  }
  & h5 {
    font-weight: 500;
    font-size: 2rem;
  }
  & h6 {
    font-weight: 500;
    font-size: 1.5rem;
  }
  & p {
    font-size: 1.6rem;
    color: var(--color-grey-500);
  }
  @media screen and (max-width: 56.25em) {
    grid-row: 3/4;
    /* text-align: center; */
  }
`
const TemplateContent = () => {
  const { template } = useTemplate()
  const content = template?.content || ""
  return <Container dangerouslySetInnerHTML={{ __html: content }}></Container>
  // return (
  //   <Container>
  //     <div>
  //       <h3>Advantages of a will</h3>
  //       <p>
  //         The starting point is that one's inheritance is distributed according
  //         to the rules of the Inheritance Act. Here, it applies that it is only
  //         one's spouse and life heirs who receive inheritance. If a family will
  //         has been created, you have the opportunity to influence the
  //         distribution of your inheritance and therefore bypass the general
  //         rules in the Inheritance Act. When creating a will, you can therefore
  //         make your partner or friend an heir. However, there are rules on
  //         compulsory inheritance that cannot be circumvented when creating a
  //         will. Our will can be used by the whole family, regardless of family
  //         composition - married, cohabiting, single , with/without children,
  //         etc.
  //       </p>
  //     </div>
  //     <div>
  //       <h3>Life heirs and special children</h3>
  //       <p>
  //         Life heirs are one's joint children and grandchildren, including only
  //         biological or adopted children . Only life heirs are covered by forced
  //         inheritance. Special children are where only one spouse or cohabitant
  //         is the parent of the child. Special children therefore inherit only
  //         from their biological parents. By creating a family will, on the other
  //         hand, it is possible for special children to receive an inheritance.
  //       </p>
  //     </div>
  //     <div>
  //       <h3>Unchanged residence</h3>
  //       <p>
  //         When the surviving spouse sits in the undivided estate, this means
  //         that he or she gets the right to dispose of the deceased spouse's
  //         assets. The inheritance from the deceased is therefore not distributed
  //         in the case of an undivided estate. The inheritance will only be
  //         distributed after the longest surviving spouse passes away. The
  //         surviving spouse has the right to sit in the unchanged home with joint
  //         children. The same does not apply to the first deceased's special
  //         children. Here, express consent is required from the special children.
  //         If consent has not been obtained, the inheritance must therefore be
  //         distributed as a starting point.
  //       </p>
  //     </div>
  //     <div>
  //       <h3>Forced inheritance</h3>
  //       <p>
  //         Irrespective of whether a family will has been created, you cannot
  //         bypass the forced inheritance. These rules are irrevocable, which
  //         means that it is not possible to bequeath the forced inheritance away.
  //         According to the Inheritance Act , life heirs are entitled to 25%
  //         (1/4) of your inheritance. You are free to bequeath the remaining 75%.
  //         If there are no life heirs, one can bequeath the entire inheritance
  //         away. Life heirs are also referred to as 1st inheritance class and
  //         consist of spouse and life heirs (children, grandchildren and
  //         great-grandchildren).
  //       </p>
  //     </div>
  //     <div>
  //       <h3>Inheritance classes</h3>
  //       <p>
  //         The Inheritance Act is divided into 3 different inheritance classes.
  //         The inheritance must first of all accrue to the persons in the first
  //         inheritance class. If, as a deceased person, you leave no one behind
  //         in the first class of inheritance, the inheritance will go to the
  //         entitled persons in the next class of inheritance, etc.
  //       </p>
  //     </div>
  //   </Container>
  // )
}

export default TemplateContent
