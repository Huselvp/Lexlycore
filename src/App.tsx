import Login from "./pages/Login";
import Profile from "./pages/admin/Profile";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminTemplates from "./pages/admin/Templates";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Account from "./pages/Account";
import Dashboard from "./pages/admin/Dashboard";
import Questions from "./pages/admin/Questions";
import AddQuestion from "./pages/admin/AddQuestion";
import EditQuestion from "./pages/admin/EditQuestion";
import Choices from "./pages/admin/Choices";
import AuthRoute from "./ui/AuthRoute";
import PersonalInfoData from "./features/Account/PersonalInfoData";
import LoginSecurityData from "./features/Account/LoginSecurityData";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import StaticLayout from "./ui/StaticLayout";
import CreateDocument from "./pages/users/CreateDocument";
import Documents from "./pages/users/Documents";
import Templates from "./pages/Templates";
import Template from "./pages/Template";
import Pay from "./pages/Pay";
import Article from "./pages/Article";
import Contact from "./pages/Contact";
import AddTemplate from "./pages/admin/AddTemplate";
import EditTemplate from "./pages/admin/EditTemplate";
import EditDocument from "./pages/users/EditDocument";
import Dictionary from "./pages/Dictionary";
import News from "./pages/News";
import ProtectedRoute from "./ui/protectedRoute";
import AddSubQuestion from "./pages/admin/AddSubQuestion";
import EditSubQuestion from "./pages/admin/EditSubQuestion";
// import QuestionnaireWizard from "./ui/Testing/Wizard";
// import AddNewForm from "./pages/admin/addNewForm";
// import FormBlocs from "./pages/admin/formBlocs";

// ===

import AddSubSubQuestion from "./pages/admin/subSubQuestionsDocs/AddSubSubQuestion";

import EditSubSubQuestion from "./pages/admin/subSubQuestionsDocs/EditSubSubQuestion";

import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route index path="/" element={<Home />} />

        <Route path="/templates" element={<Templates />} />
        <Route path="/article/:article" element={<Article />} />
        <Route path="/templates/:templateId" element={<Template />} />
        <Route element={<StaticLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms&conditions" element={<Terms />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/news" element={<News />} />
        </Route>
        {/* A */}
        <Route path="/a/*" element={<Profile userRole="ADMIN" />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="templates" element={<AdminTemplates />} />
          <Route path="templates/addTemplate" element={<AddTemplate />} />

          <Route
            path="templates/editTemplate/:templateId"
            element={<EditTemplate />}
          />

          {/* <Route
            path="templates/:templateId/seeBlocks/:blocId"
            element={<FormBlocs />}
          />

          <Route
            path="templates/:templateId/addNewForm/:formId"
            element={<AddNewForm />}
          /> */}

          <Route path="templates/:templateId" element={<Questions />} />
          <Route
            path="templates/:templateId/:questionId"
            element={<Choices />}
          />
          <Route
            path="templates/:templateId/addQuestion"
            element={<AddQuestion />}
          />
          <Route
            path="templates/:templateId/addSubQuestion/:questionId"
            element={<AddSubQuestion />}
          />

          <Route
            path="templates/:templateId/addSubSubQuestion/:questionId"
            element={<AddSubSubQuestion />}
          />

          <Route
            path="templates/:templateId/editSubQuestion/:questionId/:subquestionId"
            element={<EditSubQuestion />}
          />

          {/* <Route
            path="templates/:templateId/editSubSubQuestion/:questionId/:subquestionId"
            element={<EditSubSubQuestion />}
          /> */}

          <Route
            path="templates/:templateId/editQuestion/:questionId"
            element={<EditQuestion />}
          />
          {/* <Route
            path="templates/:templateId/editSubQuestion/:questionId"
            element={<EditSubQuestion />}
          /> */}

          {/* <Route path="notifications" element={<Notifications />} /> */}
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="account" element={<Account />}>
            <Route index element={<Navigate to="personal-info" />} />
            <Route path="personal-info" element={<PersonalInfoData />} />
            <Route path="login-info" element={<LoginSecurityData />} />
          </Route>
        </Route>
        {/* U */}
        <Route element={<ProtectedRoute userRole="SUSER" />}>
          <Route path="/pay" element={<Pay />} />
          <Route
            path="createDocument/:templateId/:documentId"
            element={<CreateDocument />}
          />
          <Route
            path="editDocument/:templateId/:documentId"
            element={<EditDocument />}
          />
        </Route>
        <Route path="/u/*" element={<Profile userRole="SUSER" />}>
          <Route index element={<Navigate replace to="documents" />} />
          <Route path="documents" element={<Documents />} />
          {/* <Route path="notifications" element={<Notifications />} /> */}
          <Route path="account" element={<Account />}>
            <Route index element={<Navigate to="personal-info" />} />
            <Route path="personal-info" element={<PersonalInfoData />} />
            <Route path="login-info" element={<LoginSecurityData />} />
          </Route>
        </Route>
        {/* Auth */}
        <Route element={<AuthRoute />}>
          <Route path="/login/user" element={<Login />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Route>
        {/*  */}
        <Route path="/pageNotFound" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
