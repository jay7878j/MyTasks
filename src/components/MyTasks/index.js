import {Component} from 'react'

import {MdDelete} from 'react-icons/md'
import {v4} from 'uuid'
import './index.css'

const tagsList = [
  {
    optionId: 'HEALTH',
    displayText: 'Health',
    isActive: false,
  },
  {
    optionId: 'EDUCATION',
    displayText: 'Education',
    isActive: false,
  },
  {
    optionId: 'GAMES',
    displayText: 'Games',
    isActive: false,
  },
  {
    optionId: 'ENTERTAINMENT',
    displayText: 'Entertainment',
    isActive: false,
  },
  {
    optionId: 'SPORTS',
    displayText: 'Sports',
    isActive: false,
  },
  {
    optionId: 'TRAVEL',
    displayText: 'Travel',
    isActive: false,
  },
  {
    optionId: 'OTHERS',
    displayText: 'Others',
    isActive: false,
  },
]

class MyTasks extends Component {
  state = {
    userTask: '',
    selectedTag: tagsList[0].optionId,
    tasksList: [],
    selectedTagsList: [],
    tagsListActive: tagsList,
  }

  componentDidMount() {
    const localTasksList = localStorage.getItem('taskList')
    const parsedData = JSON.parse(localTasksList)
    if (parsedData === null) {
      this.setState({tasksList: []})
    } else {
      this.setState({tasksList: parsedData})
    }
  }

  componentDidUpdate() {
    const {tasksList} = this.state
    localStorage.setItem('taskList', JSON.stringify([...tasksList]))
  }

  //   On Task Add Section
  onFormSubmit = event => {
    // const {tasksList} = this.state
    event.preventDefault()
    const {userTask, selectedTag} = this.state
    const taskObject = {
      id: v4(),
      task: userTask,
      tag: selectedTag,
    }

    // localStorage.setItem('taskList', JSON.stringify([...tasksList, taskObject]))

    this.setState(prev => ({
      tasksList: [...prev.tasksList, taskObject],
      userTask: '',
      selectedTag: tagsList[0].optionId,
    }))
  }

  //   User Tasks List Container
  tasksListContainer = () => {
    const {tasksList, selectedTagsList} = this.state
    const isTasksListEmpty = tasksList.length === 0
    let filterList
    if (selectedTagsList.length === 0) {
      filterList = tasksList
    } else {
      filterList = tasksList.filter(each => selectedTagsList.includes(each.tag))
    }

    return (
      <div className="tasks-container">
        <h1 className="tags-heading">Tasks</h1>
        {isTasksListEmpty ? (
          <p className="no-tasks">No Tasks Added Yet</p>
        ) : (
          <ul className="tasks-list-container">
            {filterList.map(eachTask => {
              const {id, tag, task} = eachTask
              const tagObject = tagsList.find(
                eachTag => eachTag.optionId === tag,
              )

              const onDeleteTask = () => {
                const filteredTaskList = tasksList.filter(
                  eachTaskItem => eachTaskItem.id !== id,
                )
                this.setState({tasksList: filteredTaskList})
              }

              return (
                <li className="task-list-item" key={id}>
                  <p className="task-para">{task}</p>
                  <div className="delete-task-container">
                    <p className="task-tag">{tagObject.displayText}</p>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={onDeleteTask}
                    >
                      <MdDelete className="delete-icon" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  //   Tags Btn List Container
  tagsListBtnContainer = () => {
    const {tagsListActive, selectedTagsList} = this.state

    return (
      <ul className="tags-list-container">
        {tagsListActive.map(eachTag => {
          const {optionId, displayText} = eachTag

          const onFilterTagBtnClick = () => {
            const isTagOptionPresent = selectedTagsList.indexOf(optionId)
            if (isTagOptionPresent === -1) {
              this.setState(prev => ({
                selectedTagsList: [...prev.selectedTagsList, optionId],
              }))
            } else {
              const filterTagsList = selectedTagsList.filter(
                each => each !== optionId,
              )
              this.setState({
                selectedTagsList: filterTagsList,
              })
            }
          }

          const activeTagBtn = selectedTagsList.includes(optionId)
            ? 'active-tag-btn'
            : ''

          return (
            <li className="tag-list-item" key={optionId}>
              <button
                type="button"
                className={`tag-btn ${activeTagBtn}`}
                onClick={onFilterTagBtnClick}
              >
                {displayText}
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  //   User Input Task Section
  taskInputContainer = () => {
    const {userTask} = this.state

    const onUserTaskValue = event => {
      this.setState({userTask: event.target.value})
    }

    return (
      <div className="task-input-container">
        <label htmlFor="task" className="input-label">
          Your Task
        </label>
        <textarea
          className="textarea-input-box"
          id="task"
          placeholder="Enter the task here"
          onChange={onUserTaskValue}
          value={userTask}
          required
        />
      </div>
    )
  }

  //   User Input Tag Selection Container
  tagSelectionContainer = () => {
    const {selectedTag} = this.state

    const onTagSelectionChange = event => {
      this.setState({selectedTag: event.target.value})
    }

    return (
      <div className="tag-selection-container">
        <label htmlFor="tag" className="input-label">
          Select Task Tag
        </label>
        <select
          value={selectedTag}
          className="input-box"
          id="tag"
          onChange={onTagSelectionChange}
        >
          {tagsList.map(eachTag => {
            const {optionId, displayText} = eachTag

            return (
              <option
                value={optionId}
                className="drop-down-option"
                key={optionId}
              >
                {displayText}
              </option>
            )
          })}
        </select>
      </div>
    )
  }

  render() {
    return (
      <div className="main-container">
        <div className="create-task-section">
          <h1 className="task-heading">Create a task!</h1>
          <form onSubmit={this.onFormSubmit} className="form-container">
            {this.taskInputContainer()}
            {this.tagSelectionContainer()}
            <button type="submit" className="add-task-btn">
              Add Task
            </button>
          </form>
        </div>
        <div className="user-tasks-section">
          <h1 className="tags-heading">Filter By Tags</h1>
          {this.tagsListBtnContainer()}
          {this.tasksListContainer()}
        </div>
      </div>
    )
  }
}

export default MyTasks
