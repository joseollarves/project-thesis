interface performance {
    created_at: String,
    date: Date,
    id: String,
    name: String
}

export const usePerformanceSelected = () => useState<performance>('performanceSelected', () => <performance>{});