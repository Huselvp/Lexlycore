// import { useLogout } from "../features/Authentication/useLogout"
// import { useUser } from "../features/Authentication/useUser"

// const ProfileSidebarItemsList = ({
//   userRole,
//   includeIcons,
//   onClick
// }: {
//   userRole: "ADMIN" | "SUSER"
//   includeIcons: boolean
//   onClick: () => void
// }) => {
//   const { user } = useUser()
//   const { logout } = useLogout()
//   return (
//     <>
//       {user?.role === "ADMIN" && (
//         <>
//           <li onClick={onClick}>
//             <NavLink to="/a">
//               <span>Dashboard</span>
//             </NavLink>
//           </li>
//           <li onClick={onClick}>
//             <NavLink to="/a/templates">
//               <span>Templates</span>
//             </NavLink>
//           </li>
//           <li onClick={onClick}>
//             <NavLink to="/a/categories">
//               <span>Categories</span>
//             </NavLink>
//           </li>
//           <li onClick={onClick}>
//             <NavLink to="/a/users">
//               <span>Users</span>
//             </NavLink>
//           </li>
//         </>
//       )}
//       {user?.role === "SUSER" && (
//         <>
//           <li>
//             <NavLink to="/u">
//               <span>Documents</span>
//             </NavLink>
//           </li>
//         </>
//       )}
//       <li onClick={onClick}>
//         <NavLink to={`/${user?.role === "ADMIN" ? "a" : "u"}/notifications`}>
//           <span>Notifications</span>
//         </NavLink>
//       </li>
//       <li onClick={onClick}>
//         <NavLink to={`/${user?.role === "ADMIN" ? "a" : "u"}/account`}>
//           <span>Account</span>
//         </NavLink>
//       </li>
//       <li>
//         <Btn onClick={() => logout()}>
//           <span>Logout</span>
//         </Btn>
//       </li>
//     </>
//   )
// }

// export default ProfileSidebarItemsList
