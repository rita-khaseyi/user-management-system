import React from 'react';
import { Table, Button, Modal, Form, Input, Avatar } from 'antd'; // Import Avatar component from Ant Design
import { useUserContext, User } from '../hooks/UserReducer';
import './app.css'; 

const UserTable = () => {
  // State and context hooks
  const { state, dispatch } = useUserContext();
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [editingUserId, setEditingUserId] = React.useState<number | null>(null);

  // Define a list of interesting colors
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#ff4d4f', '#52c41a'];

  // Function to get a color based on user ID
  const getColor = (id: number) => colors[id % colors.length];

  // Add a new user to the state
  const addUser = (user: User) => {
    dispatch({ type: 'ADD_USER', payload: { ...user, id: state.users.length + 1 } });
    setVisible(false); // Hide the modal
    form.resetFields(); // Reset form fields
  };

  // Edit an existing user
  const editUser = (user: User) => {
    setEditingUserId(user.id); // Set user ID for editing
    form.setFieldsValue(user); // Populate form fields with user data
    setVisible(true); // Show the modal
  };

  // Update user details
  const updateUser = (values: User) => {
    dispatch({ type: 'UPDATE_USER', payload: { ...values, id: editingUserId! } });
    setVisible(false); // Hide the modal
    form.resetFields(); // Reset form fields
    setEditingUserId(null); // Reset editing user ID
  };

  // Delete a user from the state
  const deleteUser = (userId: number) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  // Handle submission of the modal form
  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUserId !== null) {
        updateUser(values); // Update existing user
      } else {
        addUser(values); // Add new user
      }
    });
  };

  // Handle cancellation of the modal form
  const handleCancel = () => {
    setVisible(false); // Hide the modal
    form.resetFields(); // Reset form fields
    setEditingUserId(null); // Reset editing user ID
  };

  // Table columns configuration
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { 
      title: 'Avatar', 
      dataIndex: 'avatar', 
      key: 'avatar', 
      render: (_: any, user: User) => (
        <Avatar size="large" style={{ backgroundColor: getColor(user.id) }}>
          {user.name.charAt(0)}
        </Avatar>
      )
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: User) => (
        <span className="actions-cell">
          <Button type="primary" onClick={() => editUser(user)}>
            Edit
          </Button>
          <Button className="delete-button" onClick={() => deleteUser(user.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  // Render the component
  return (
    <div className="table-container">
      {/* Table displaying user data */}
      <Table dataSource={state.users} columns={columns} rowKey="id" />

      {/* Modal for adding/editing user */}
      <Modal
        title={editingUserId !== null ? 'Edit User' : 'Add User'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* Form inside the modal */}
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Button to add a new user */}
      <Button className="add-user-button" type="primary" onClick={() => setVisible(true)}>
        Add User
      </Button>
    </div>
  );
};

export default UserTable;
