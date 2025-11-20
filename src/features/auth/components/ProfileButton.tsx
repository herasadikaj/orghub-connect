import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export function ProfileButton() {
    return (
        <Button asChild variant="outline" size="sm">
            <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
            </Link>
        </Button>
    );
}
