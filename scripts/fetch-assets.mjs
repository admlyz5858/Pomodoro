import { mkdir, writeFile } from 'node:fs/promises'

const targets = [
  {
    name: 'forest.jpg',
    url: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    name: 'rain.jpg',
    url: 'https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    name: 'ocean.jpg',
    url: 'https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    name: 'mountains.jpg',
    url: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
  {
    name: 'night.jpg',
    url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1080&w=1920',
  },
]

const dir = new URL('../public/assets/downloaded/', import.meta.url)
await mkdir(dir, { recursive: true })

for (const target of targets) {
  const response = await fetch(target.url)

  if (!response.ok) {
    console.warn(`Skipped ${target.name}: ${response.status}`)
    continue
  }

  const data = Buffer.from(await response.arrayBuffer())
  await writeFile(new URL(target.name, dir), data)
  console.log(`Downloaded ${target.name}`)
}

console.log('Finished asset fetch.')
