export type FilterStyle = 'warm' | 'bw' | 'natural'

export interface Event {
  id: string
  name: string
  reveal_at: string
  filter_style: FilterStyle
  owner_id: string
  created_at: string
}

export interface Photo {
  id: string
  event_id: string
  storage_path: string
  guest_name: string | null
  created_at: string
}
