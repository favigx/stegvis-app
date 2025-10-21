import { useGetAllNoteCollections } from "../hooks/noteCollections.ts/useGetAllNoteCollections";
import styles from './NoteCollectionList.module.css'

interface NoteCollectionsListProps {
  onSelectCollection?: (collectionId: string) => void;
  selectedCollectionId?: string;
}

export default function NoteCollectionsList({
  onSelectCollection,
  selectedCollectionId,
}: NoteCollectionsListProps) {
  const { data: collections, isLoading, error } = useGetAllNoteCollections();

  if (isLoading) return <p>Laddar collections...</p>;
  if (error) return <p className={styles.error}>{error.message}</p>;
  if (!collections || collections.length === 0) return <p>Inga collections</p>;

  return (
    <div className={styles.collectionsList}>
      {collections.map((collection) => (
        <button
          key={collection.id}
          className={`${styles.collectionButton} ${
            selectedCollectionId === collection.id ? styles.selected : ""
          }`}
          onClick={() => onSelectCollection?.(collection.id)}
        >
          {collection.name} ({collection.notes.length})
        </button>
      ))}
    </div>
  );
}
