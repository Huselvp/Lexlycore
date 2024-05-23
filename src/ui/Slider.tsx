import styled from "styled-components"
import {
  IoIosArrowBack as LeftArrow,
  IoIosArrowForward as RightArrow
} from "react-icons/io"
import { useRef } from "react"

const Container = styled.section`
  h2 {
    /* text-align: center; */
  }
`

const StyledSlider = styled.div`
  padding: 2rem 0;
  display: flex;
  align-items: center;
  overflow: hidden; /* Hide any content that exceeds the box */
  position: relative;

  /* Additional styles for horizontal scrolling */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* Enables momentum scrolling in WebKit browsers */

  div {
    flex: 1;
    height: 28rem;
    display: grid;
    grid-template-columns: repeat(10, 30rem);
    gap: 1rem;
    overflow-x: auto; /* Enable horizontal scrolling */
    overflow-y: hidden;
    scroll-snap-type: x mandatory; /* Snap to the grid columns */
    position: relative;
    img {
      box-shadow: var(--shadow-md);
      border-radius: var(--rounded-md);
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
  button:first-child {
    transform: translateX(1.7rem);
  }
  button:last-child {
    transform: translateX(-1.7rem);
  }
  button {
    z-index: 10;
    box-shadow: var(--shadow-md);
    cursor: pointer;
    width: 3.5rem;
    height: 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--color-stone-900);
    background-color: var(--color-grey-100);
    &:hover {
      background-color: var(--color-grey-200);
    }

    border: none;
    svg {
      display: block;
    }
  }
`

const Slider = () => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = 400 // Adjust as needed
    const container = sliderRef.current

    if (container) {
      const scrollValue = direction === "left" ? -scrollAmount : scrollAmount
      container.scrollBy({ left: scrollValue, behavior: "smooth" })
    }
  }
  return (
    <Container>
      <h2>Templates</h2>
      <StyledSlider>
        <button onClick={() => scroll("left")}>
          <LeftArrow />
        </button>
        <div ref={sliderRef}>
          <img
            src="https://source.unsplash.com/random/1600x900/?nature"
            alt="Image 1"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?architecture"
            alt="Image 2"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?technology"
            alt="Image 3"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?travel"
            alt="Image 4"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?food"
            alt="Image 5"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?fashion"
            alt="Image 6"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?music"
            alt="Image 7"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?sports"
            alt="Image 8"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?business"
            alt="Image 9"
          />
          <img
            src="https://source.unsplash.com/random/1600x900/?abstract"
            alt="Image 10"
          />
        </div>
        <button onClick={() => scroll("right")}>
          <RightArrow />
        </button>
      </StyledSlider>
    </Container>
  )
}

export default Slider
