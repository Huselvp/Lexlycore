import styled from "styled-components"
import { HiOutlineArrowNarrowRight as ArrowRightIcon } from "react-icons/hi"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  /* 800px */
  @media screen and (max-width: 50em) {
    grid-template-columns: repeat(2, 1fr);
  }
  /* 400px */
  @media screen and (max-width: 25em) {
    grid-template-columns: 1fr;
  }
`
const Article = styled.div<{ img: string }>`
  & section {
    z-index: 1000000;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* transform: scale(0); */
    border-radius: var(--rounded-xl);
    background-color: transparent;
    transition: transform 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    /* filter: brightness(0.5); */
    transition: backdrop-filter 0.25s ease-in-out;
    & button {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-radius: var(--rounded-3xl);
      border: none;
      padding: 1.2rem 2.4rem;
      transition: all 0.25s ease-in-out;
      transform: scale(0);
      &:hover {
        gap: 2rem;
      }
    }
  }
  &:hover section {
    backdrop-filter: brightness(0.5);
    & button {
      transform: scale(100%);
    }
  }
  /* border-radius: var(--rounded-md); */
  border-radius: var(--rounded-xl);
  overflow: hidden;
  border: 1px solid var(--color-grey-100);
  box-shadow: var(--shadow-sm);
  min-height: 40rem;
  position: relative;
  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.8) 100%
    ),
    url(${(props) => props.img}) no-repeat center center / cover;
  /* background-size: cover; */

  & > div {
    position: absolute;
    left: 0;
    bottom: 0;
    color: var(--white);
    -webkit-tap-highlight-color: transparent;
    padding: 2rem 1rem;
    /* opacity: 0; */
    & > div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    & p:first-of-type {
      text-transform: capitalize;
      line-height: 1.2;
      font-size: 2.25rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    & p:last-of-type {
      font-size: 1.2rem;
      color: var(--color-grey-50);
    }
  }
`
const Container = styled.div`
  background-color: var(--white);
  padding: 6rem 2rem;
  & > div:first-child {
    font-size: 2.8rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 5rem;
  }
`

const Articles = ({
  data
}: {
  data: { img: string; title: string; link: string; description: string }[]
}) => {
  const navigate = useNavigate()
  const [hoveredArticle, setHoveredArticle] = useState<null | string>(null)

  return (
    <Container>
      <div>Seneste artikler</div>
      <Content>
        {data.map((article) => (
          <Article
            img={article.img}
            onMouseEnter={() => setHoveredArticle(article.title)}
            onMouseLeave={() => setHoveredArticle(null)}
          >
            <section>
              <button onClick={() => navigate(`/article/${article.link}`)}>
                <span>Read more</span>
                <ArrowRightIcon />
              </button>
            </section>
            <div>
              <p>{article.title}</p>
              <p>{article.description}</p>
            </div>
          </Article>
        ))}
      </Content>
    </Container>
  )
}

export default Articles
