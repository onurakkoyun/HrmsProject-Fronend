import { Fragment, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid'

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]
const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]
const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const initialSubCategoriesState = subCategories.map((category) => ({
  ...category,
  checked: false,
}))

export default function JobPostingsList2() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [subCategoriesState, setSubCategoriesState] = useState(
    initialSubCategoriesState,
  )

  const handleSubCategoryToggle = (index) => {
    const updatedSubCategories = [...subCategoriesState]
    updatedSubCategories[index].checked = !updatedSubCategories[index].checked
    setSubCategoriesState(updatedSubCategories)
  }

  return (
    <div className="bg-white mt-8">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-[0px] bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-[0px] z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-2 pb-6 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-1 flex h-5 w-5 items-center justify-center rounded-md bg-white p-1 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters subCategories*/}
                  <form className="mt-2 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul
                      role="list"
                      className="px-1 py-2 font-medium font-mulish"
                    >
                      {subCategories.map((category) => (
                        <li key={category.name}>
                          <a
                            href={category.href}
                            className="block px-1 py-2 text-gray-900"
                          >
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                    {/* ---------------  Mobil Kategori basliklari    ------------------- */}
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-2 py-3"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-1 -my-2 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-1 py-2 text-gray-400 hover:text-gray-500">
                                <span className="font-medium font-mulish text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-3 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-3 w-3"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            {/*--------------------   Mobil Kategori icerikleri   ------------------*/}
                            <Disclosure.Panel className="pt-3">
                              <div className="space-y-3">
                                {section.options.map((option, optionIdx) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center font-mulish"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      defaultValue={option.value}
                                      type="checkbox"
                                      defaultChecked={option.checked}
                                      className="h-2 w-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-2 min-w-[0px] flex-1 text-gray-800"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/*--------------  Desktop icerikleri    ----------------*/}
        <main className="mx-auto max-w-[1248px] px-2 sm:px-3 lg:px-4">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-2 pt-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              New Arrivals
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-3 w-3 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  {/*-----------   Sort icerikleri  ---------------- */}
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-10 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              href={option.href}
                              className={classNames(
                                option.current
                                  ? 'font-medium text-gray-900'
                                  : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-3 py-1 text-sm',
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-3 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-3 p-1 text-gray-400 hover:text-gray-500 sm:ml-3 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-6 pt-2">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-3 gap-y-5 lg:grid-cols-2">
              {/*-----------------------   Desktop Filters Icerikleri--------------------------*/}
              <form className="hidden lg:block w-10">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-1 py-2 font-medium">
                  {subCategoriesState.map((category, index) => (
                    <li className="mb-2" key={category.name}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={category.checked}
                          onChange={() => handleSubCategoryToggle(index)}
                          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-800">
                          {category.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-3"
                  >
                    {({ open }) => (
                      <>
                        {/*----------------   Desktop diğer Filters Icerikleri  ----------------- */}
                        <h3 className="-my-2 flow-root">
                          <Disclosure.Button className="flex w-10 items-center justify-between bg-white py-2 text-md text-gray-400 hover:text-gray-500">
                            <span className="font-medium font-mulish text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-3 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        {/*------------ Desktop Filters Alt bilesenleri ----------------*/}
                        <Disclosure.Panel className="pt-3">
                          <div className="space-y-2">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-3 w-3 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-2 text-sm text-gray-800"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-2">{/* Your content */}</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
