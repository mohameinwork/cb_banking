import { RouterProvider } from "react-router-dom";
import { router } from "./Route";
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
