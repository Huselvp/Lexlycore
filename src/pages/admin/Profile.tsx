import styled from "styled-components";
import Sidebar from "../../ui/Sidebar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import { useUser } from "../../features/Authentication/useUser";
import ProfileHeader from "../../ui/ProfileHeader";
import MobileSidebar from "../../ui/MobileSidebar";
import { useWindowListener } from "../../hooks/useWindowListener";

const Container = styled.div`
  display: grid;
  height: 100dvh;
  overflow: hidden;
  grid-template-columns: auto 1fr;
  main {
    padding: 3rem;
    padding-bottom: 12rem;
    /* overflow-y: ; */
    h2 {
      text-align: start;
      font-size: 3rem;
      margin: 0;
      font-weight: 600;
    }
  }
  @media screen and (max-width: 37.5em) {
    /* 600px */
    grid-template-columns: 1fr;
    & main {
      padding: 3rem 2rem;
    }
  }
  /* 400px */
  @media screen and (max-width: 25em) {
    & main {
      padding: 3rem 1rem;
    }
  }
`;

const Profile = ({ userRole }: { userRole: "ADMIN" | "SUSER" }) => {
  const { isLoading, isAuthenticated, user } = useUser();
  const navigate = useNavigate();

  const [hideSidebarOnMobile, setHideSidebarOnMobile] = useState<boolean>(true);
  const { windowWidth } = useWindowListener();
  const onMobile = windowWidth <= 600;
  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated]);
  if (isLoading) return <Spinner />;
  if (!isLoading && !isAuthenticated) return null;
  // @ts-ignore
  if (user?.role !== userRole) return <Navigate to="/pageNotFound" />;

  return (
    <Container>
      {onMobile ? (
        <MobileSidebar
          hideSidebarOnMobile={hideSidebarOnMobile}
          setHideSidebarOnMobile={setHideSidebarOnMobile}
        />
      ) : (
        <Sidebar />
      )}
      <div style={{ overflowY: "auto" }}>
        <ProfileHeader
          onMobile={onMobile}
          setHideSidebarOnMobile={setHideSidebarOnMobile}
        />
        <main
          style={{
            backgroundColor: "var(--color-grey-50)",
            minHeight: "100dvh",
          }}
        >
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default Profile;
