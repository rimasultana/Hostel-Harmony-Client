import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const Home = () => {
  const {} = useAuth();
  return (
    <div>
      <h1>Home page </h1>
      <Button>Click</Button>
    </div>
  );
};

export default Home;
