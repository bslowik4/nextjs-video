import ImageInput  from '@/app/ui/edit/imageInput';
import ProtectedRoute from '../ui/edit/protectedRout';
import Layout from '@/app/layout';

const EditPage: React.FC = () => {

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