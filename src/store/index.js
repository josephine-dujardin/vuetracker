import { createStore, createLogger } from 'vuex'
import { v4 as uuid } from '@lukeed/uuid'
import * as TaskService from '../services/TaskService.js'

const store = createStore({
    state () {
        return {
            tasks: null,
            areTasksLoading: false,
            currentTaskname: '',
            currentStartTime: null,
            isTaskInProgress: false
        }
    },
    mutations: {
        SET_TASKS (state, tasks) {
            state.tasks = tasks
        },
        SET_ARE_TASKS_LOADING (state, bool) {
            state.areTasksLoading = bool
        },
        ADD_TASK (state, newTask) {
            state.tasks.unshift(newTask)
        },
        DELETE_TASK (state, taskIndex ) {
            state.tasks.splice(taskIndex, 1)
        },
        SET_CURRENT_TASKNAME (state, value) {
            state.currentTaskname = value
        },
        SET_CURRENT_START_TIME (state, value) {
            state.currentStartTime = value
        },
        SET_IS_TASK_IN_PROGRESS (state, bool) {
            state.isTaskInProgress = bool
        }
    },
    actions: {

        async fetchAllTasks({ commit }) {
            commit('SET_ARE_TASKS_LOADING', true)
            try {
                const allTasks = await TaskService.getAll()
                commit('SET_TASKS', allTasks)
                commit('SET_ARE_TASKS_LOADING', false)
            }   catch(e) {
                commit('SET_ARE_TASKS_LOADING', false)
                throw e
            }
            
        },

        async updateAllTasks({ state }) {
            await TaskService.updateAll(state.tasks)
        },
   
        deleteTask ({ state, commit }, taskID) {
            // Récupération de l'index de la tâche
            let taskIndex = null
            state.tasks.forEach((task, index) => {
              if (task.id === taskID) {
                taskIndex = index
              }
            })
            // Suppression de la tâche
            commit('DELETE_TASK', taskIndex)
        },

        startTask ({ commit }) {
            commit('SET_IS_TASK_IN_PROGRESS', true)
            commit('SET_CURRENT_START_TIME', Date.now())
        },

        stopTask ({ state, commit }) {
            // Enregistrement de la tâche
            const newTask = {
                id: uuid(),
                name: state.currentTaskname,
                startTime: state.currentStartTime,
                endTime: Date.now()
            }
            commit('ADD_TASK', newTask)

            // Fin de la tâche
            commit('SET_IS_TASK_IN_PROGRESS', false)
            commit('SET_CURRENT_TASKNAME', '')
        },

        restartTask({ state, commit, dispatch }, newTaskname) {
            // Arrêt de la tâche en cours si besoin
            if (state.isTaskInProgress) {
                dispatch('stopTask')
            }
            // Lancement de la nouvelle tâche
            setTimeout(() => {
                commit('SET_CURRENT_TASKNAME', newTaskname)
                dispatch('startTask')
            })
        }

    },
    getters: { 
        tasksByDay (state) {
            if (state.tasks) {
                const tasksByDay = {}
                state.tasks.forEach(task => {
                    const currentDayTS = (new Date(task.startTime)).setHours(0, 0, 0, 0)
                    if (!tasksByDay[currentDayTS]) {
                        tasksByDay[currentDayTS] = []
                    }
                    tasksByDay[currentDayTS].push(task)
                })
                return tasksByDay
            } else {
                return {}
            }
        }
     },
    plugins: import.meta.env.MODE != 'production' ? [createLogger()] : []
})

export default store