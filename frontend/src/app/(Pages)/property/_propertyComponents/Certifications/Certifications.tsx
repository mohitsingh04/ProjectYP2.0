"use client";
import API from "@/service/API/API";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface CertificationsData {
  certifications: string[];
}

interface CertificationsProps {
  property: { uniqueId: string } | null;
}

export default function Certifications({ property }: CertificationsProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [certifications, setCertifications] =
    useState<CertificationsData | null>(null);

  const getCertifications = async () => {
    try {
      const response = await API.get(`/certifications/${property?.uniqueId}`);
      setCertifications(response.data);
    } catch (error) {
      console.error((error as any)?.message);
    }
  };

  useEffect(() => {
    if (property) {
      getCertifications();
    }
  }, [property]);

  const filteredImages =
    certifications?.certifications
      ?.filter((img: string) => img.toLowerCase().endsWith(".webp"))
      ?.map((img: string) => ({
        src: `${process.env.NEXT_PUBLIC_MEDIA_URL}/${img}`,
      })) || [];

  return (
    <>
      <div className="card">
        <div className="card-body">
          <h5 className="subs-title">Certifications</h5>
          <div className="row">
            {filteredImages.map((img, idx) => (
              <div className="col-md-3" key={idx}>
                <img
                  src={img.src}
                  alt="Achievement"
                  className="img-fluid"
                  style={{ aspectRatio: "1/1", objectFit: "cover" }}
                  onClick={() => {
                    setIndex(idx);
                    setOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={filteredImages}
        zoom={{ maxZoomPixelRatio: 10, scrollToZoom: true }}
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
        thumbnails={{ position: "bottom" }}
        styles={{ container: { zIndex: 1050 } }}
      />
    </>
  );
}
