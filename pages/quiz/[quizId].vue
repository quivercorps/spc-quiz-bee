<template>
  <div class="lg:w-1/2 xl:w-1/3 mx-auto pb-10">
    <div class="fixed w-full lg:w-1/2 xl:w-1/3 mx-auto bg-[#121212] z-50">
      <NavBar 
        :pageName="quiz?.name ?? ''"
        :username="user!.userName"
        :items="items"
        :is-back-to-dashboard="true"
        :is-edit="true"
        @change-page-name="changePageName"></NavBar>
    </div>
    
    <div class="p-3 pt-20">
      <UAccordion default-open multiple :items="quiz!.categories" :ui="{ wrapper: 'flex flex-col w-full' }">
        <template #default="{item, open}">
          <div class="flex">
            <UButton color="gray" variant="ghost" class="flex-1 border-b border-gray-200 dark:border-gray-700" :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }">

              <span class="truncate">{{ item.name }}</span>

              <template #trailing>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-5 h-5 ms-auto transform transition-transform duration-200"
                  :class="[open && 'rotate-90']"
                />
              </template>
            </UButton>
            
          </div>
        </template>
        
        <template #item="{item: category, index}">
          
          <div>
            <UTabs :items="[{slot: 'questions', label: 'Questions'}, {slot: 'options',  label: 'Settings'}]">
              <template #default="{item}">
                {{ item.label }}
              </template>
              <template #questions="{item}">
                <div class="mb-3" v-for="question in categorizedQuestions[category._id]">
                  <QuestionCard 
                  :question="question" 
                  :index="index" 
                  @update-questions="updateQuestions"
                  @delete-question="deleteQuestion"
                  @create-choice="createChoice"></QuestionCard>
                </div>
                <div @click="addQuestion(category)" class="add-button">Add Question</div>
              </template>
              <template #options="{item}">
                <div>
                  <div class="flex items-center gap-5">
                    <ChangeNameInput 
                      :name="category.name" 
                      :index="category.id"
                      :timer="category.defaultTimer"
                      :score="category.defaultScore"
                      placeholder="Enter Category Name..." 
                      @change-category-name="changeCategoryName" 
                      ></ChangeNameInput>
                  </div>
                  
                  <div class="flex flex-row-reverse">
                    <UButton @click="removeCategoryAt(category.id)" color="red" variant="ghost" icon="i-heroicons-trash">Remove Category</UButton>
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
        </template>
      </UAccordion>
      <!-- <draggableComponent
        :list="quiz!.categories"
        item-key="index"
      >
        <template #item="{element, index}">
          <div class="dark:bg-gray-900 border dark:border-gray-700 rounded my-5">
            <draggableComponent  :list="categorizedQuestions[element]" :group="element" item-key="_id">
              <template #header>
                <div class="flex justify-between items-center border-b dark:border-gray-700 p-3">
                  <div class="capitalize">
                    <ChangeNameInput :name="element" :index="index" placeholder="Enter Category Name..." @change-category-name="changeCategoryName"></ChangeNameInput>
                  </div>
                  <UButton @click="removeCategoryAt(index)" color="red" variant="ghost" icon="i-heroicons-x-mark"></UButton>
                </div>
              </template>
              <template #item="{element, index}">
                <QuestionCard :question="element" :index="index" @update-questions="updateQuestions"></QuestionCard>
              </template>
              <template #footer>
                <div class="p-3">
                  <div @click="addQuestion(element)" class="add-button">Add Question</div>
                </div>
              </template>
            </draggableComponent>
          </div>
        </template>
      </draggableComponent> -->
      <div @click="createCategory" class="add-button mt-5 hover:h-24 transition-height duration-200 ease-in-out h-8  flex items-center">
        <p>Add Category</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import draggableComponent from 'vuedraggable';
import type { User } from '~/types/chat.interface';
import { QuestionType } from '~/types/enum';
import type { Category, Question, Quiz } from '~/types/quiz.interface';

const { $api } = useNuxtApp()
const route = useRoute()
const {getSession, unsetSession} = useSession()
const session = getSession()

const {data: user} = await useAPI<User>('users/profile', {
    headers: {
        Authorization: `Bearer ${session!}`
    }
})

const {data: quiz,  refresh: quizRefresh} = await useAPI<Quiz>(`quiz/${route.params.quizId}`, {
  headers: {
        Authorization: `Bearer ${session!}`
    }
})

const items = [
    [{
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth-solid',
    }],
    [{
        label: 'Logout',
        icon: 'i-heroicons-arrow-left-end-on-rectangle-solid',
        click: async () => {
            unsetSession()
            await navigateTo('/')
        }
    }]
]

watchEffect(() => {
    if (!session) {
        navigateTo('/')
    }
})

const categorizedQuestions = computed<Record<string, Question[]>>(() => {
  if (!quiz.value || !quiz.value.questions) return {}

  // Initialize each category with an empty array
  const result: Record<string, Question[]> = {}
  quiz.value.categories.forEach(category => {
    result[category._id] = []
  })

  // Populate with actual questions
  quiz.value.questions.forEach(question => {
    console.log(question.category)
    if (result[question.category]) {
      result[question.category].push(question)
    } else {
      result[question.category] = [question]
    }
  })

  console.log(result)

  return result
})

async function changePageName(pageName: string) {
  quiz.value!.name = pageName

  await $api('quiz/update/name', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session}`
    },
    body: {
      quizId: quiz.value?._id,
      quizName: pageName
    }
  })
}

const createCategory = async () => {
  await $api('quiz/create_category', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session}`
    },
    body: {
      quizId: quiz.value?._id,
      categoryName: 'New Category'
    }
  })
  quizRefresh()
}

async function createChoice(questionId: string) {
  const newChoice = {
    questionId,
    text: 'A New Choice',
    isCorrect: false
  }
  await $api('quiz/create/choice', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session}`
    },
    body: newChoice
  })

  quizRefresh()
}

async function addQuestion(category: Category) {
  const newQuestion = {
    quizId: quiz.value?._id,
    questionType: QuestionType.MultipleChoice,
    category: category,
    timer: category.defaultTimer,
    score: category.defaultScore,
    text: "Are you making a quiz?",
    choices: [
      {
        text: 'Yes',
        isCorrect: true
      },
      {
        text: 'No',
        isCorrect: false
      }
    ]
  }

  await $api('quiz/create_question', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session}`
    },
    body: newQuestion
  })

  quizRefresh()

  
}

async function changeCategoryName(categoryName: string, score: number, timer: number, index: number) {
  await $api('quiz/update/category/name', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session}`
      },
      body: {
        quizId: quiz.value?._id,
        categoryName: categoryName,
        defaultTimer: timer,
        defaultScore: score,
        categoryId: index 
      }
    })

  quizRefresh()
}

async function removeCategoryAt(index: number) {
  if (window.confirm("Are you sure you want to revove this category?")) {
    await $api('quiz/delete/category', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session}`
      },
      body: {
        quizId: quiz.value?._id,
        categoryId: index 
      }
    })

    quizRefresh()
  }
}

async function updateQuestions(question: Question, index: number) {
  const q = await $api<Question>('quiz/update/question', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session}`
    },
    body: {
      quizId: quiz.value?._id,
      questionId: question._id,
      questionType: question.questionType,
      timer: question.timer,
      category: question.category,
      text: question.text,
      choices: question.choices
    }
  })

  quizRefresh()
}

async function deleteQuestion(question: Question) {
  console.log("hello?")
  if (window.confirm("Are you sure you want to revove this category?")) {
    await $api('quiz/delete/question', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session}`
      },
      body: {
        quizId: quiz.value?._id,
        questionId: question._id
      }
    })

    quizRefresh()
  }
}

</script>

<style>
.hoverable {
  @apply text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500  hover:dark:text-gray-300 hover:dark:border-gray-300;
}
.add-button {
    @apply flex justify-center p-2 border-2 border-dashed rounded cursor-pointer hoverable;
}
</style>
