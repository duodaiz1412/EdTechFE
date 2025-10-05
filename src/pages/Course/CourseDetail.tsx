import {Link, useParams} from "react-router-dom";
import ReadOnlyRating from "@/components/ReadOnlyRating";
import {Languages} from "lucide-react";
import CourseContentList from "./CourseContent/CourseContentList";
import {publicServices} from "@/lib/services/public.services";
import {useQuery} from "@tanstack/react-query";
import {CourseLabelProps, CourseTagProps} from "@/types";

export default function CourseDetail() {
  const {slug} = useParams();

  const {data} = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const response = await publicServices.getCourseBySlug(slug!);

      return response;
    },
  });

  return (
    <div className="w-full max-w-[1380px] mx-auto">
      <div className="flex items-start space-x-4 pt-6">
        <div className="w-2/3 space-y-10">
          <h2 className="text-3xl font-bold">{data?.title}</h2>
          <div className="space-y-3 text-sm">
            <p className="text-xl">{data?.shortIntroduction}</p>
            <div className="flex space-x-2 items-start">
              <span className="font-semibold text-orange-900">
                {data?.rating || 0}
              </span>
              <ReadOnlyRating rating={data?.rating || 0} size="xs" />
              <span>({data?.enroll || 0})</span>
            </div>
            {/* <div>
              Created by
              {course?.instructors.map((instructor) => (
                <Link
                  to={`/user/${instructor}`}
                  key={instructor}
                  className="link ml-2"
                >
                  {instructor}
                </Link>
              ))}
            </div> */}
            <div className="flex items-center space-x-6">
              <div className="flex space-x-2">
                <Languages size={20} />: <span>{data?.language}</span>
              </div>
              <div className="flex space-x-2">
                {data?.labels.map((label: CourseLabelProps) => (
                  <span key={label.id} className="badge badge-primary">
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="card border border-slate-200">
            <div className="card-body">
              <div className="card-title mb-4">What you'll learn</div>
              <div className="grid grid-cols-2 gap-4">
                {course?.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div> */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Explore related topics
            </h3>
            {data?.tags.map((tags: CourseTagProps) => (
              <Link to="/" key={tags.id} className="btn mr-4">
                {tags.name}
              </Link>
            ))}
          </div>
          {/* <div>
            <h3 className="text-xl font-semibold mb-4">Course contents</h3>
            <CourseContentList curriculum={course?.curriculum} />
          </div> */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p>{data?.description}</p>
          </div>
          {/* <div>
            <h3 className="text-xl font-semibold mb-4">Requirements</h3>
            <ul className="list-disc list-inside space-y-2">
              {course?.requirements.map((req) => <li key={req}>{req}</li>)}
            </ul>
          </div> */}
          {/* <div>
            <h3 className="text-xl font-semibold mb-4">Target audience</h3>
            <ul className="list-disc list-inside space-y-2">
              {course?.whoIsThisCourseFor.map((learner) => (
                <li key={learner}>{learner}</li>
              ))}
            </ul>
          </div> */}
        </div>
        <div className="w-1/3 card shadow rounded-lg">
          <figure>
            {data?.image && <img src={data.image} />}
            {!data?.image && (
              <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400">No Image</span>
              </div>
            )}
          </figure>
          <div className="card-body space-y-2">
            <h3 className="font-semibold">This course includes:</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
