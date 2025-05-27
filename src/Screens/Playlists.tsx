import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getPlaylists, createPlaylist, savePlaylists} from 'services/playlists';
import { appEvents } from '../utils/events';
import { Playlist } from 'src/types';
import Colors from 'src/Constants/Colors';

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [renamingPlaylist, setRenamingPlaylist] = useState<Playlist | null>(null);
  const [renameText, setRenameText] = useState('');
  const [deletingPlaylist, setDeletingPlaylist] = useState<Playlist | null>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadPlaylists = async () => {
      const data = await getPlaylists();
      setPlaylists(data);
    };

    const unsubscribe = navigation.addListener('focus', loadPlaylists);
    return unsubscribe;
  }, [navigation]);

  const handleCreate = async () => {
    if (!newPlaylistName.trim()) return;
    const updated = await createPlaylist(newPlaylistName.trim());
    setPlaylists(updated);
    setNewPlaylistName('');
    appEvents.emit('playlistsUpdated');
  };

  const handleRename = async () => {
    if (!renamingPlaylist || !renameText.trim()) return;
    const updated = playlists.map((p) =>
      p.id === renamingPlaylist.id ? { ...p, name: renameText.trim() } : p
    );
    await savePlaylists(updated);
    setPlaylists(updated);
    setRenamingPlaylist(null);
    setRenameText('');
    appEvents.emit('playlistsUpdated');
  };

  const handleDelete = async () => {
    if (!deletingPlaylist) return;
    const updated = playlists.filter((p) => p.id !== deletingPlaylist.id);
    await savePlaylists(updated);
    setPlaylists(updated);
    setDeletingPlaylist(null);
    appEvents.emit('playlistsUpdated');
  };

  const renderItem = ({ item }: { item: Playlist }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('PlaylistDetail', {
            playlist: item,
          })
        }
      >
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.trackCount}>{item.tracks.length} morceau(x)</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        setRenamingPlaylist(item);
        setRenameText(item.name);
      }}>
        <Ionicons name="pencil" size={20} color="#aaa" style={{ marginHorizontal: 8 }} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setDeletingPlaylist(item)}>
        <Ionicons name="trash" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#121212' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune playlist pour le moment.</Text>
        }
      />

      {/* Création en bas */}
      <View style={styles.bottomInput}>
        <TextInput
          style={styles.input}
          placeholder="Nom de la nouvelle playlist"
          placeholderTextColor="#888"
          value={newPlaylistName}
          onChangeText={setNewPlaylistName}
        />
        <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
          <Text style={{ color: '#fff' }}>Créer</Text>
        </TouchableOpacity>
      </View>

      {/* Modal renommer */}
      <Modal transparent visible={!!renamingPlaylist} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setRenamingPlaylist(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Renommer la playlist</Text>
            <TextInput
              style={styles.input}
              value={renameText}
              onChangeText={setRenameText}
              placeholder="Nouveau nom"
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.createButton} onPress={handleRename}>
              <Text style={{ color: '#fff' }}>Renommer</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Modal supprimer */}
      <Modal transparent visible={!!deletingPlaylist} animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setDeletingPlaylist(null)}>
          <Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              Supprimer "{deletingPlaylist?.name}" ?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: '#ff4d4d', flex: 1, marginRight: 8 }]}
                onPress={handleDelete}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: '#333', flex: 1 }]}
                onPress={() => setDeletingPlaylist(null)}
              >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackCount: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 40,
  },
  bottomInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: Platform.OS === 'android'? Colors.platform.android.primary : Colors.platform.ios.primary,
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
});

export default Playlists;
