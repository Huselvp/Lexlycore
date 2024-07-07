import React, { createContext, useContext, useEffect } from "react";
import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import { Reorder } from "framer-motion";
import { getApiConfig } from "../utils/constants";
import axios from "axios";

const StyledTable = styled.div.attrs({ role: "table" })`
  border: 1px solid var(--color-grey-200);
  font-size: 1.4rem;
  background-color: var(--color-grey-0);
  border-radius: var(--rounded-lg);
  /* overflow: hidden; */
`;
const StyledBody = styled.div``;
const CommonRow = styled.div.attrs({ role: "row" })<{ columns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.columns};
  column-gap: 2.4rem;
  align-items: center;
  justify-items: start;
  transition: none;
`;
const StyledRow = styled(CommonRow)`
  padding: 1.2rem 2.4rem;
  position: relative;
  text-transform: capitalize;
  position: relative;
  a {
    opacity: 0;
  }
  &:hover {
    a {
      opacity: 1;
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;
const Footer = styled.footer`
  background-color: var(--color-grey-50);
  display: flex;
  justify-content: center;
  padding: 1.2rem;

  /* This will hide the footer when it contains no child elements. Possible thanks to the parent selector :has 🎉 */
  &:not(:has(*)) {
    display: none;
  }
`;
const StyledHeader = styled(CommonRow)`
  padding: 1.6rem 2.4rem;
  background-color: var(--color-grey-50);
  border-bottom: 1px solid var(--color-grey-100);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-600);
  border-radius: var(--rounded-lg);
`;
const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
`;

const TableContext = createContext({ columns: "" });

const Table = ({
  columns,
  children,
}: {
  columns: string;
  children: React.ReactNode;
}) => {
  return (
    <TableContext.Provider value={{ columns }}>
      <StyledTable>{children}</StyledTable>
    </TableContext.Provider>
  );
};
const Header = ({ children }: { children: React.ReactNode }) => {
  const { columns } = useContext(TableContext);
  return <StyledHeader columns={columns}>{children}</StyledHeader>;
};
const Row = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const { columns } = useContext(TableContext);

  return (
    <StyledRow columns={columns} id={id}>
      {children}
    </StyledRow>
  );
};
const Body = <T extends Category | Template | Question | Choice | User>({
  data,
  render,
}: {
  data: T[];
  render: (item: T) => JSX.Element;
}) => {
  if (!data.length) return <Empty>No data to show at the moment</Empty>;
  return <StyledBody>{data.map(render)}</StyledBody>;
};

const OrderedBody = <T extends Category | Template | Question | Choice | User>({
  data,
  render,
  onReorder,
}: {
  data: T[];
  render: (item: T) => JSX.Element;
  onReorder: (newOrder: T[]) => void;
}) => {
  if (!data.length) return <Empty>No data to show at the moment</Empty>;
  return (
    <StyledBody>
      <Reorder.Group onReorder={onReorder} values={data}>
        {data.map(render)}
      </Reorder.Group>
    </StyledBody>
  );
};

const Link = styled(RouterLink)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-grey-100);
  color: var(--color-grey-600);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  span {
  }
`;

Table.Link = Link;
Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;
Table.OrderedBody = OrderedBody;

export default Table;
