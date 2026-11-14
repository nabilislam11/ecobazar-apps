import { Link } from 'react-router-dom';

export default function BrandCard({ brand }) {
    return (
        <Link
            to={`/brand/${brand.slug}`}
            className="flex items-center justify-center rounded-lg border border-gray-100 p-8 grayscale transition hover:grayscale-0"
        >
            <span className="text-medium font-semibold text-gray-700">{brand.name}</span>
        </Link>
    );
}
