import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const Declaration = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/membership">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registration
        </Button>
      </Link>

      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-6">Member Declaration</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Declaration of Membership</h2>
            <p className="text-gray-700">
              I, the undersigned, hereby declare that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>All information provided in my membership application is true and accurate to the best of my knowledge.</li>
              <li>I am joining this party voluntarily and without any coercion.</li>
              <li>I am not a member of any other political party in Kenya.</li>
              <li>I subscribe to the party's constitution, policies, and manifesto.</li>
              <li>I will promote the party's objectives and abide by its rules and regulations.</li>
              <li>I understand that providing false information may lead to the termination of my membership.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Membership Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Participate in party activities and meetings when called upon.</li>
              <li>Pay membership fees and other contributions as prescribed by the party.</li>
              <li>Promote party policies and programs.</li>
              <li>Maintain party unity and cohesion.</li>
              <li>Respect and adhere to party leadership decisions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Special Categories</h2>
            <p className="text-gray-700">
              For members registering under special interest categories:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Persons with Disabilities (PWD) must provide valid PWD registration numbers.</li>
              <li>Ethnic Minorities must be from recognized minority communities in Kenya.</li>
              <li>Marginalized Communities must be from officially recognized marginalized areas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Data Protection</h2>
            <p className="text-gray-700">
              By submitting this declaration, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Your personal information will be handled in accordance with Kenya's Data Protection Act, 2019.</li>
              <li>The party will maintain confidentiality of your personal information.</li>
              <li>Your data will only be used for legitimate party purposes.</li>
              <li>You have the right to access, correct, or update your information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Legal Framework</h2>
            <p className="text-gray-700">
              This declaration is made in accordance with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>The Constitution of Kenya, 2010</li>
              <li>Political Parties Act, 2011</li>
              <li>Elections Act, 2011</li>
              <li>The party's Constitution and By-laws</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Declaration 