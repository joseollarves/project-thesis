interface task {
    id: String,
    in_charge: Array<String>,
    name: String,
    status: Boolean
}
export const useTaskSelected = () => useState<task>('taskSelected', () => <task>{});