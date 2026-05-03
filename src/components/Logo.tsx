import { Link } from "react-router-dom";
import logoImg from "@/assets/logo.jpg";

export const Logo = ({ to = "/" }: { to?: string }) => (
    <Link to={to} className="flex items-center gap-2 group">
        <img
            src={logoImg}
            alt="Vireon AI logo"
            className="h-10 w-10 rounded-lg object-cover transition-smooth group-hover:scale-105"
        />
        <span className="font-display text-xl font-bold tracking-tight">
            Vireon<span className="text-gradient"> AI</span>
        </span>
    </Link>
);
