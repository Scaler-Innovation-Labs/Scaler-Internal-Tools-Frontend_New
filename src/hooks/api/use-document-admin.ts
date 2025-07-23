import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth/use-auth';
import { config } from '@/lib/configs';

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface DocumentCreatePayload {
  title: string;
  categoryId: number;
  tagIds: number[];
  allowedUsers: string[];
  file: File;
}

export function useDocumentAdmin() {
  const { fetchWithAuth } = useAuth();
  const backend = config.api.backendUrl;

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${backend}/document/admin/category/getAll`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('fetchCategories', e);
    }
  }, [backend, fetchWithAuth]);

  const fetchTags = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${backend}/document/admin/tag/getAllTags`);
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
    } catch (e) {
      console.error('fetchTags', e);
    }
  }, [backend, fetchWithAuth]);

  const deleteCategory = useCallback(async (id:number):Promise<boolean>=>{
    try{
      const res = await fetchWithAuth(`${backend}/document/admin/category/delete/${id}`,{method:'DELETE'});
      if(res.ok){
        await fetchCategories();
        return true;
      }
      return false;
    }catch(e){console.error('deleteCategory',e);return false;}
  },[backend,fetchWithAuth,fetchCategories]);

  const deleteTag = useCallback(async(id:number):Promise<boolean>=>{
    try{
      const res = await fetchWithAuth(`${backend}/document/admin/tag/delete/${id}`,{method:'DELETE'});
      if(res.ok){
        await fetchTags();
        return true;
      }
      return false;
    }catch(e){console.error('deleteTag',e);return false;}
  },[backend,fetchWithAuth,fetchTags]);

  const createDocument = useCallback(async (payload: DocumentCreatePayload): Promise<boolean> => {
    try {
      const form = new FormData();
      form.append('title', payload.title);
      form.append('categoryId', payload.categoryId.toString());
      payload.tagIds.forEach((id) => form.append('tagId', id.toString()));
      payload.allowedUsers.forEach((u) => form.append('userAllowed', u));
      form.append('file', payload.file);

      const res = await fetchWithAuth(`${backend}/document/admin/create`, {
        method: 'POST',
        body: form,
      });
      return res.ok;
    } catch (e) {
      console.error('createDocument', e);
      return false;
    }
  }, [backend, fetchWithAuth]);

  const createCategory = useCallback(async (name: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`${backend}/document/admin/category/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchCategories();
        return true;
      }
      return false;
    } catch (e) {
      console.error('createCategory', e);
      return false;
    }
  }, [backend, fetchWithAuth, fetchCategories]);

  const createTag = useCallback(async (name: string): Promise<boolean> => {
    try {
      const res = await fetchWithAuth(`${backend}/document/admin/tag/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchTags();
        return true;
      }
      return false;
    } catch (e) {
      console.error('createTag', e);
      return false;
    }
  }, [backend, fetchWithAuth, fetchTags]);

  const updateDocument = useCallback(
    async (
      documentId: number,
      payload: Partial<DocumentCreatePayload>,
    ): Promise<boolean> => {
      try {
        const form = new FormData();
        if (payload.title) form.append('title', payload.title);
        if (payload.categoryId) form.append('categoryId', payload.categoryId.toString());
        if (payload.tagIds)
          payload.tagIds.forEach((id) => form.append('tagId', id.toString()));
        if (payload.allowedUsers)
          payload.allowedUsers.forEach((u) => form.append('allowedUsers', u));
        if (payload.file) form.append('file', payload.file);

        const res = await fetchWithAuth(`${backend}/document/admin/update/${documentId}`, {
          method: 'PUT',
          body: form,
        });
        return res.ok;
      } catch (e) {
        console.error('updateDocument', e);
        return false;
      }
    },
    [backend, fetchWithAuth],
  );

  const fetchVersions = useCallback(async (documentId: number) => {
    const res = await fetchWithAuth(
      `${backend}/document/admin/version/getAllByDocId/${documentId}`,
    );
    if (!res.ok) return [];
    return res.json();
  }, [backend, fetchWithAuth]);

  const deleteDocument = useCallback(async (id:number):Promise<boolean>=>{
    try{
      const res=await fetchWithAuth(`${backend}/document/admin/delete/${id}`,{method:'DELETE'});
      return res.ok;
    }catch(e){console.error('deleteDocument',e);return false;}
  },[backend,fetchWithAuth]);

  const deleteVersion = useCallback(async (versionId:number):Promise<boolean>=>{
    try{
      const res = await fetchWithAuth(`${backend}/document/admin/version/delete/${versionId}`,{method:'DELETE'});
      return res.ok;
    }catch(e){console.error('deleteVersion',e);return false;}
  },[backend,fetchWithAuth]);

  return {
    categories,
    tags,
    fetchCategories,
    fetchTags,
    createDocument,
    createCategory,
    createTag,
    updateDocument,
    fetchVersions,
    deleteDocument,
    deleteCategory,
    deleteTag,
    deleteVersion,
  };
} 