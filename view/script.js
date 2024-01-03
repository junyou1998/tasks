const API_URL = "http://127.0.0.1:5038";
const { ref, onMounted } = Vue;

const App = {
    setup() {
        const tasks = ref([]);
        const refreshData = async () => {
            axios.get(API_URL + "/api/tasks").then((res) => {
                tasks.value = res.data;
            });
        };
        const addNewTask = async () => {
            let newTasks = document.querySelector("#newTask").value;
            const formData = new FormData();
            formData.append("newTasks", newTasks);

            axios.post(API_URL + "/api/tasks", formData).then((res) => {
                refreshData();
                alert(res.data);

                console.log("add successful");
            });
        };
        const deleteTask = async (_id) => {
            axios.delete(API_URL + "/api/tasks/" + _id).then((res) => {
                refreshData();
                alert(res.data);
                console.log("delete successful");
            });
        };
        const updateTask = async (_id, updateValue, status) => {
            axios
                .patch(API_URL + "/api/tasks/" + _id, { updateTask: updateValue, doneStatus: status })
                .then((res) => {
                    refreshData();
                    alert(res.data);
                    console.log("update successful");
                })
                .catch((err) => {
                    console.error("error updating task", err);
                });
        };

        onMounted(refreshData);
        return { tasks, addNewTask, deleteTask, updateTask };
    },
};

Vue.createApp(App).mount("#app");
