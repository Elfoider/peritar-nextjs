'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

// This page detects the user's role and redirects accordingly.
export default function DashboardPage() {
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [status, setStatus] = useState('Redirigiendo...');

    useEffect(() => {
        if (isUserLoading || !firestore) {
            return; // Wait for user and firestore to be available
        }

        if (!user) {
            router.replace('/login');
            return;
        }

        const rolePaths: { [key: string]: string } = {
            super_usuarios: '/dashboard/super-usuario',
            aseguradoras: '/dashboard/aseguradora',
            talleres: '/dashboard/taller',
            peritos: '/dashboard/perito',
            clientes: '/dashboard/cliente',
        };

        const checkRole = async () => {
            for (const collectionPath in rolePaths) {
                const docRef = doc(firestore, collectionPath, user.uid);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        router.replace(rolePaths[collectionPath]);
                        return; // Found role, exit loop
                    }
                } catch (error) {
                    console.error(`Error checking collection ${collectionPath}:`, error);
                }
            }
            // If no role is found after checking all collections
            setStatus("No se pudo determinar tu rol. Contacta a soporte.");
            // Optional: Sign out the user if they have no role
            // auth.signOut();
            // router.replace('/login');
        };

        checkRole();

    }, [user, isUserLoading, firestore, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>{status}</p>
        </div>
    );
}
