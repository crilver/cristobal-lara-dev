interface DeviceMockupProps {
  laptopSrc: string;
  phoneSrc: string;
  laptopAlt?: string;
  phoneAlt?: string;
}

/**
 * Laptop (primary) + phone (secondary) device cluster, ported 1:1 from the
 * CoraVet marketing landing page. Pure CSS frames (see `.cv-*` rules in
 * global.css) with the real product screenshots filling the screens.
 */
export default function DeviceMockup({
  laptopSrc,
  phoneSrc,
  laptopAlt = '',
  phoneAlt = '',
}: DeviceMockupProps) {
  return (
    <div className="cv-device-cluster">
      <div className="cv-laptop" role="img" aria-label={laptopAlt}>
        <div className="cv-laptop-screen">
          <img
            className="cv-screen-img"
            src={laptopSrc}
            alt={laptopAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="cv-laptop-base" aria-hidden="true" />
      </div>

      <div className="cv-phone" role="img" aria-label={phoneAlt}>
        <div className="cv-phone-notch" aria-hidden="true" />
        <img
          className="cv-screen-img"
          src={phoneSrc}
          alt={phoneAlt}
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
