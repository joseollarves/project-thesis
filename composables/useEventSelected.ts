interface event {
    id: String,
    name: String,
    description: String,
    date: String,
}
export const useEventSelected = () => useState<event>('eventSelected', () => <event>{});