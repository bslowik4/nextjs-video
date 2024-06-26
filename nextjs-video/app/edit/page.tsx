import ImageInput  from '@/app/ui/edit/imageInput';import { useEffect, useState } from 'react';
import fetcher from '../utils/fetch';
import { getToken } from '../utils/auth';
import ProtectedRoute from '../ui/edit/protectedRoute';
import Layout from '@/app/layout';

const EditPage: React.FC = () => {
  const [editData, setEditData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const data = await fetcher('/api/edit', token);
        setEditData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        <h1>Edit Page</h1>
        <ImageInput />
      </Layout>
    </ProtectedRoute>
  );
};

export default EditPage;
