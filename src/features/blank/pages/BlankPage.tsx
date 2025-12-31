'use client';

import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { setSmallTitle } from "@/store/layoutSlice";
import { Helmet } from "react-helmet-async";

export default function BlankPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSmallTitle("Innovation Scoring Dashboard"));
    document.title = "Innovation Scoring Dashboard | AI Innovation Scoring Dashboard";
    return () => {
      dispatch(setSmallTitle("Dashboard"));
      document.title = "AI Innovation Scoring Dashboard";
    };
  }, [dispatch]);


  return (
    <div style={{ padding: "24px" }}>
      <Helmet>
        <title>Innovation Scoring Dashboard | AI Innovation Scoring Dashboard</title>
      </Helmet>

      Blank Page
    </div>
  );
}
