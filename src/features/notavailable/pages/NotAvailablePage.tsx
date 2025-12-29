import { useEffect } from "react";
import { setSmallTitle } from "@/store/layoutSlice";
import { useAppDispatch } from "@/hooks/redux";
import { Helmet } from "react-helmet-async";
import nodataVideo from "@/assets/img/nodata.mp4";
import { Card } from "antd";



export default function NotAvailablePage() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setSmallTitle("Page Not Available"));
        document.title = "Page Not Available For Demo Version| AI Innovation Scoring Dashboard";

        return () => {
            dispatch(setSmallTitle("Dashboard"));
            document.title = "AI Innovation Scoring Dashboard";
        };
    }, [dispatch]);
    return (
        <>
            <Helmet>
                <title>Not Available | AI Innovation Scoring Dashboard</title>
            </Helmet>

            <Card className="noborderHeader cardNotAvailable">
                <div>
                    <h1>Page Not Available For Demo Version</h1>
                    <p>This feature is not available in the demo version. Please stay tuned for upcoming updates.
                        Contact us for more information at zafarlabs.com.</p>
                    <video
                        src={nodataVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ maxWidth: "150px", width: "100%", marginTop: "20px", borderRadius: "12px" }}
                    />
                </div>
            </Card>

        </>
    );
}
