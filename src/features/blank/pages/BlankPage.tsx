import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";

export default function BlankPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Blank Page"));
    document.title = "Blank Page | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Blank Page | AI Innovation Scoring Dashboard</title>
      </Helmet>
    </div>
  );
}

