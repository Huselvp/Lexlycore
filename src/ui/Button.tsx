import styled, { css } from "styled-components"

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `
}

const variations = {
  priamry: css`
    color: var(--color-stone-50);
    /* background-color: var(--color-stone-500); */
    background-color: var(--color-stone-550);
    &:hover {
      background-color: var(--color-stone-600);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `
}

const Button = styled.button<{
  size: keyof typeof sizes
  variation: keyof typeof variations
}>`
  border: none;
  border-radius: var(--rounded);
  cursor: pointer;
  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
`


export default Button
