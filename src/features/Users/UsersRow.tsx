import styled from "styled-components";
import Table from "../../ui/Table";
const ImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 2rem;
    height: 2rem;
  }
`;
const UsersRow = ({ user, onMobile }: { user: User; onMobile: boolean }) => {
  return (
    <Table.Row id={`menus-row--${user.userId}`}>
      <ImgContainer>
        <img src="/user.jpg" />
      </ImgContainer>
      <div className="hideOverflow">{user.username || " — "}</div>
      {!onMobile && <div className="hideOverflow">{user.country || " — "}</div>}
      <div className="hideOverflow">{user.phonenumber || " — "}</div>
    </Table.Row>
  );
};

export default UsersRow;
