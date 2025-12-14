import Image from "next/image";
import {
        FaHome,
        FaFortAwesome,
        FaMapMarkerAlt,
        FaShoppingBag,
        FaShoppingBasket,
        FaSubway,
} from "react-icons/fa";

const DEFAULT_LOCATION = {
        city: "Madrid, Comunidad de Madrid, Spain",
        description:
                "Magnificent and beautiful place to stay, very central in the heart of the Salamanca neighborhood, very well connected by bus and close to three metro stations, so you'll quickly be anywhere in the city. It is a neighborhood with many shops and restaurants, in fact you can walk.",
        mapImageSrc: "/images/madrid_map_placeholder.png",
};

const POI_FILTERS = [
        { label: "Restaurants", Icon: FaMapMarkerAlt },
        { label: "Shopping", Icon: FaShoppingBag },
        { label: "Transport Hub", Icon: FaSubway },
        { label: "Attractions", Icon: FaFortAwesome },
        { label: "Groceries", Icon: FaShoppingBasket },
];

const POIButton = ({ label, Icon }) => (
        <button className="flex items-center space-x-1 rounded-full px-3 py-1 text-[12px] text-gray-700 transition hover:text-emerald-600">
                <Icon size={14} className="text-gray-500" />
                <span>{label}</span>
        </button>
);

export default function WhereYoullBeMap({ location }) {
        const mapData = {
                ...DEFAULT_LOCATION,
                ...(location || {}),
        };

        return (
                <section className="w-full max-w-7xl px-4 py-12 md:px-6 lg:px-8">
                        <h2 className="text-2xl font-semibold text-slate-900">Where you will be</h2>

                        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
                                <div className="relative h-[480px] w-full">
                                        <Image
                                                src={mapData.mapImageSrc}
                                                alt={`Map view of ${mapData.city}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 70vw"
                                        />

                                        <div className="absolute top-3 right-3 z-10 flex flex-col space-y-2">
                                                {["+", "-", "[]"].map((label) => (
                                                        <button
                                                                key={label}
                                                                className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-700 shadow-sm"
                                                                type="button"
                                                        >
                                                                {label}
                                                        </button>
                                                ))}
                                        </div>

                                        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
                                                <div className="rounded-full border-4 border-white bg-emerald-500 p-2 text-white shadow-xl">
                                                        <FaHome size={20} />
                                                </div>
                                        </div>

                                        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full border border-slate-200 bg-white/95 px-5 py-2 shadow-xl">
                                                {POI_FILTERS.map((filter) => (
                                                        <POIButton key={filter.label} {...filter} />
                                                ))}
                                        </div>
                                </div>

                                <div className="flex flex-col gap-4 p-6 md:p-8">
                                        <h3 className="text-xl font-semibold text-slate-900">{mapData.city}</h3>
                                        <p className="max-w-4xl text-sm leading-relaxed text-slate-600">{mapData.description}</p>
                                        <button className="self-start text-sm font-semibold text-emerald-600 transition hover:text-emerald-700" type="button">
                                                Show more
                                        </button>
                                </div>
                        </div>
                </section>
        );
}