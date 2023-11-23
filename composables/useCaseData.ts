// Tipo Caso
interface caso {
    id: string;
    number: string | null;
    motive: string | null;
    description: string | null;
    demandant: string | null;
    demanded: string | null;
    status: boolean;
    collaborators: string[];
    performances: object | null;
  }

export const useCaseData = () => useState<caso>('caseData', () => <caso>{});